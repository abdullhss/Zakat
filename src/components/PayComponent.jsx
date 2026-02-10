import { ImagePlus, Loader2, CheckCircle, FileText, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import PropTypes from 'prop-types';
import moenyWhite from "../public/SVGs/moneyWhite.svg";
import { executeProcedure, DoTransaction, DoMultiTransaction } from "../services/apiServices";
import { HandelFile } from "./HandelFile";
import { setShowPopup, closeAllPopups, setPopupComponent } from "../features/PaySlice/PaySlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import cartReducer, { setCartData } from "../features/CartSlice/CartSlice";
import { useNavigate } from "react-router-dom";
import { toArabicWord } from 'number-to-arabic-words/dist/index-node.js';
import { motion, AnimatePresence } from "framer-motion";
import ZakatWasl from "./ZakatWasl";
import { jsPDF } from 'jspdf'
import * as htmlToImage from 'html-to-image'

const PAYMENT_GATEWAY_URL = "https://moaamalat.almedadsoft.com";

const PayComponent = ({
  officeName = "",
  officeId = "",
  accountTypeId = "",
  serviceTypeId = "2",
  totalAmount = 0,
  currency = "د.ل",
  actionID = "1",
  SubventionType_Id = "0",
  Project_Id = "0",
  PaymentDesc = "",
  Salla = false ,
  donationNameForLover = "",
  zakatFitrItms = []
}) => {
  const [donationType, setDonationType] = useState(null);
  const [localMethod, setLocalMethod] = useState(null);
  const [internationalBankAccountsData, setInternationalBankAccountsData] = useState([]);
  const [localBankAccountsData, setLocalBankAccountsData] = useState([]);
  const [selectedInternationalAccount, setSelectedInternationalAccount] = useState("");
  const [selectedLocalAccount, setSelectedLocalAccount] = useState("");
  const [selectedInternationalAccountNumber, setSelectedInternationalAccountNumber] = useState("");
  const [selectedLocalAccountNumber, setSelectedLocalAccountNumber] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileId, setUploadedFileId] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileError, setFileError] = useState("");
  const [electronicPaymentSystemReference, setElectronicPaymentSystemReference] = useState("");
  const [isOpeningGateway, setIsOpeningGateway] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [paymentData, setPaymentData] = useState(null); // Store payment data to send to iframe
  const waslRef = useRef(null)
  const [donationDate, setDonationDate] = useState("");
  const [donationId, setDonationId] = useState("");
  const [donationAmountInWords, setDonationAmountInWords] = useState("");

  const afterSaveElectronicPaymentIdRef = useRef(null);
  const fileRef = useRef(null);
  const iframeRef = useRef(null);
  const merchantRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const gradientBtn = "bg-gradient-to-r from-[#24645E] via-[#18383D] to-[#17343B] text-white";
  const grayBtn = "bg-[#C9C9C9] text-black";

  // Message handler for iframe communication
  useEffect(() => {
    const handleMessage = async (event) => {
      console.log('Received message from gateway:', event.data);
      
      // Filter out React devtools messages
      if (event.data && event.data.source === 'react-devtools-bridge') {
        return;
      }
      
      switch (event.data.type) {
        case 'PAYMENT_SUCCESS':
          await handlePaymentSuccess(event.data.data);
          break;
          
        case 'PAYMENT_ERROR':
          handlePaymentError(event.data.data);
          break;
          
        case 'PAYMENT_CANCELLED':
          handlePaymentCancelled();
          break;
          
        case 'IFRAME_READY':
          // Iframe is ready, send payment data
          console.log('Iframe is ready, sending payment data...');
          if (showIframe && iframeRef.current && paymentData) {
            setTimeout(() => {
              if (iframeRef.current && iframeRef.current.contentWindow) {
                console.log('Sending payment data to iframe:', paymentData);
                iframeRef.current.contentWindow.postMessage({
                  type: 'INIT_PAYMENT',
                  params: paymentData
                }, '*');
              }
            }, 100);
          }
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [showIframe, paymentData]);

  const handlePaymentSuccess = async (paymentData) => {
    setElectronicPaymentSystemReference(paymentData.SystemReference);
    
    try {
      // Update payment record with gateway response
      const response = await DoTransaction(
        "rCSWIwrXh3HGKRYh9gCA8g==",
        `${afterSaveElectronicPaymentIdRef.current}#${totalAmount}#${paymentData.SystemReference}#${paymentData.NetworkReference}`,
        1,
        "Id#PaymentValue#SystemReference#NetworkReference"
      );
      
      console.log('Payment update response:', response);
      
      // Close iframe
      setShowIframe(false);
      setIsOpeningGateway(false);
      
      // Show success message
      toast.success('تم الدفع بنجاح');
      await downloadWaslPDF();

      
      // Reset all states
      resetForm();
      dispatch(setShowPopup(false));
      dispatch(closeAllPopups());
      
      // Handle post-payment actions
      handlePostPaymentActions();
      
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error('حدث خطأ أثناء تحديث حالة الدفع');
    }
  };

  const handlePaymentError = (errorData) => {
    console.error('Payment error:', errorData);
    setShowIframe(false);
    setIsOpeningGateway(false);
    toast.error(`فشل الدفع: ${errorData.error || 'حدث خطأ غير معروف'}`);
  };

  const handlePaymentCancelled = () => {
    console.log('Payment was cancelled by user');
    setShowIframe(false);
    setIsOpeningGateway(false);
    toast.info('تم إلغاء الدفع');
  };

  const handlePostPaymentActions = () => {
    if (Salla && JSON.parse(localStorage.getItem("UserData"))?.Id) {
      const handleFetchCartData = async () => {
        try {
          const data = await executeProcedure(
            "ErZm8y9oKKuQnK5LmJafNAUcnH+bSFupYyw5NcrCUJ0=",
            JSON.parse(localStorage.getItem("UserData")).Id
          );
          dispatch(setCartData(data.decrypted));
        } catch (error) {
          console.error('Error fetching cart data:', error);
        }
      };
      handleFetchCartData();
      navigate("/");
    }
    
    if (actionID == 1 || actionID == 2) {
      showReminderPopup();
    }
  };

  const showReminderPopup = () => {
    toast.info(
      <div className="flex flex-col gap-3">
        <span className="font-semibold">تريد انشاء تذكير؟</span>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-emerald-600 text-white rounded-md"
            onClick={() => {
              toast.dismiss();
              navigate("/remember");
            }}
          >
            ذهاب
          </button>
          <button
            className="px-3 py-1 border rounded-md"
            onClick={() => toast.dismiss()}
          >
            إلغاء
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
      }
    );
  };

  const resetForm = () => {
    setDonationType(null);
    setLocalMethod(null);
    setSelectedInternationalAccount("");
    setSelectedLocalAccount("");
    setSelectedInternationalAccountNumber("");
    setSelectedLocalAccountNumber("");
    setUploadedFileId("");
    setUploadedFileName("");
    setFileError("");
    setPaymentData(null);
    setDonationDate("");
    setDonationId("");
    setDonationAmountInWords("");
  };

  // Open payment gateway in iframe
  const openPaymentGateway = async () => {
    setIsOpeningGateway(true);
    
    try {
      // Fetch payment parameters
      const GetElectParametersData = await executeProcedure(
        "XPkLod2NSVCM0aXC325W4FRbmaZdYSv5oKkVb3jxQ6w=",
        `${officeId}#${actionID == 1 ? 1 : 2}#$????`
      );

      const electparametersData = JSON.parse(GetElectParametersData.decrypted.ElectParametersData);
      console.log('Payment parameters:', electparametersData);
      
      if (!electparametersData || electparametersData.length === 0) {
        throw new Error('No payment parameters found');
      }
      
      // Generate merchant reference
      if (!merchantRef.current) {
        merchantRef.current = crypto.randomUUID();
      }
      
      const merchRef = merchantRef.current;
      
      // Save initial payment record
      await callPaymentProcedure({
        bankId: electparametersData[0].Bank_Id,
        accountNum: electparametersData[0].AccountNum,
        Merchant_Id: electparametersData[0].Merchant_Id,
        Terminal_Id: electparametersData[0].Terminal_Id,
        MerchantReference: merchRef
      });
      
      // Prepare payment data for gateway
      const paymentParams = {
        mID: electparametersData[0].Merchant_Id,
        tID: electparametersData[0].Terminal_Id,
        merchantKey: electparametersData[0].Secure_key,
        merchantReference: merchRef,
        amount: totalAmount
      };
      
      console.log('Payment params prepared:', paymentParams);
      
      // Store payment data to send to iframe when it's ready
      setPaymentData(paymentParams);
      
      // Open iframe with payment gateway
      setIframeKey(prev => prev + 1);
      setShowIframe(true);
      
    } catch (error) {
      console.error('Error opening payment gateway:', error);
      setIsOpeningGateway(false);
      toast.error('فشل في فتح بوابة الدفع');
    }
  };

  // When iframe loads, check if we have payment data to send
  useEffect(() => {
    if (showIframe && iframeRef.current && paymentData) {
      console.log('Iframe shown, checking if ready to send data...');
    }
  }, [showIframe, paymentData]);

  const handleUploadClick = () => {
    if (fileRef.current && !isUploading) {
      fileRef.current.click();
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setFileError("يرجى رفع ملف من النوع: PDF, PNG, JPG, JPEG فقط");
      return;
    }

    setFileError("");
    setIsUploading(true);
    setUploadProgress(0);
    setUploadedFileId("");
    setUploadedFileName("");

    try {
      const handelFile = new HandelFile();
      const result = await handelFile.UploadFileWebSite({
        action: "Add",
        file: file,
        fileId: "",
        SessionID: "",
        onProgress: (progress) => {
          setUploadProgress(progress);
        }
      });

      if (result.status === 200) {
        setUploadedFileId(result.id);
        setUploadedFileName(file.name);
      } else {
        console.error("Upload failed:", result.error);
        setFileError("فشل رفع الملف. حاول مرة أخرى");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setFileError("حدث خطأ أثناء رفع الملف");
    } finally {
      setIsUploading(false);
    }
  };
  const downloadWaslPDF = async () => {
    if (!waslRef.current) return;
    
    // Wait for next tick to ensure content is rendered
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Ensure element is visible for capture
    const waslElement = waslRef.current;
    const originalStyle = waslElement.getAttribute('style');
    waslElement.setAttribute('style', 'position: absolute; top: 0; left: 0; width: 800px; background: white; padding: 24px; visibility: visible; opacity: 1;');
    
    try {
      const dataUrl = await htmlToImage.toPng(waslElement, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`zakat-wasl-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('فشل في إنشاء PDF');
    } finally {
      // Restore original style
      if (originalStyle) {
        waslElement.setAttribute('style', originalStyle);
      } else {
        waslElement.removeAttribute('style');
      }
    }
  };
  
  const callPaymentProcedure = async (saveElectronicDataBeforePayment) => {
    if (!uploadedFileId && (donationType === "international" || localMethod === "bank")) {
      return;
    }
    
    setIsProcessing(true);
  
    try {
      let paymentWayId = "2";
      let paymentMethodIdValue = "1";
      
      if (donationType === "international") {
        paymentWayId = "1";
        paymentMethodIdValue = "0";
      } else if (donationType === "local") {
        paymentWayId = "2";
        paymentMethodIdValue = localMethod === "electronic" ? "1" : "2";
      }
  
      const currentDate = new Date();
      const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;
      
      // Save the donation date to state
      setDonationDate(formattedDate);
      
      // Calculate Arabic words for amount
      const amountInWords = `${toArabicWord(totalAmount)} دينار ليبي فقط لا غير`;
      setDonationAmountInWords(amountInWords);
  
      let accountNum = "";
      let bankId = "0";
  
      if (donationType === "international") {
        accountNum = selectedInternationalAccountNumber;
        const selectedAccount = JSON.parse(selectedInternationalAccount);
        bankId = selectedAccount.BankId || selectedAccount.Id || "0";
      } else if (donationType === "local" && localMethod === "bank") {
        accountNum = selectedLocalAccountNumber;
        const selectedAccount = JSON.parse(selectedLocalAccount);
        bankId = selectedAccount.Bank_Id || "0";
      }
  
      const params = [
        "0",
        formattedDate,
        PaymentDesc === "" ? electronicPaymentSystemReference : PaymentDesc,
        paymentMethodIdValue == 1 ? 0 : totalAmount.toString(),
        actionID,
        paymentWayId,
        paymentMethodIdValue,
        SubventionType_Id,
        Project_Id,
        officeId || "0",
        paymentMethodIdValue == 1 ? saveElectronicDataBeforePayment?.bankId : bankId,
        paymentMethodIdValue == 1 ? saveElectronicDataBeforePayment?.accountNum : accountNum,
        uploadedFileId || "",
        paymentMethodIdValue == 1 ? "True" : "False",
        JSON.parse(localStorage.getItem("UserData"))?.Id || 0,
        paymentMethodIdValue == 1 ? saveElectronicDataBeforePayment?.Merchant_Id : "",
        paymentMethodIdValue == 1 ? saveElectronicDataBeforePayment?.Terminal_Id : "",
        paymentMethodIdValue == 1 ? saveElectronicDataBeforePayment?.MerchantReference : "",
        "",
        ""
      ].join("#");
  
      const response = await DoTransaction("rCSWIwrXh3HGKRYh9gCA8g==", params);
      console.log("Payment procedure response:", response);
      
      // Save the donation ID to state
      setDonationId(response.id);
      afterSaveElectronicPaymentIdRef.current = response.id;
  
      if (response?.success) {
        if (paymentMethodIdValue != 1) {
          toast.success("تم الدفع بنجاح");
          
          // Now we can safely download the PDF since we have all the data
          await downloadWaslPDF();
  
          dispatch(setShowPopup(true));
          resetForm();
          dispatch(setShowPopup(false));
          dispatch(closeAllPopups());
          
          if (Salla && JSON.parse(localStorage.getItem("UserData"))?.Id) {
            const handleFetchCartData = async () => {
              const data = await executeProcedure(
                "ErZm8y9oKKuQnK5LmJafNAUcnH+bSFupYyw5NcrCUJ0=",
                JSON.parse(localStorage.getItem("UserData")).Id
              );
              dispatch(setCartData(data.decrypted));
            };
            handleFetchCartData();
            navigate("/");
          }
          
          if (actionID == 1 || actionID == 2) {
            showReminderPopup();
          }
        }
      }
      if (actionID == 11) {
        const tableName = "EHOuQy3M1MyrTQunV/qrDfNvGI0mh1DAqD1w/7TFA2Q=";
      
        const tablesString = Array(zakatFitrItms.length)
          .fill(tableName)
          .join('^');
      
        const dataString = zakatFitrItms
          .map(item =>
            `0#${JSON.parse(localStorage.getItem("UserData"))?.Id || 0}#` +
            `${new Date().toLocaleDateString('en-GB').replace(/\//g, '/') + ' ' + new Date().toLocaleTimeString('en-GB')}#` +
            `${item.Id}#${item.quantity}`
          )
          .join('^');
      
        console.log(tablesString, dataString);
      
        const response = await DoMultiTransaction(tablesString, dataString);
        console.log(response);
      }      
  
    } catch (error) {
      console.error("Error calling payment procedure:", error);
      toast.error("حدث خطأ أثناء معالجة الدفع");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayNow = () => {
    if (donationType === "local" && localMethod === "electronic") {
      openPaymentGateway();
    } else if (uploadedFileId) {
      callPaymentProcedure();
    } else {
      toast.error("يرجى رفع ملف إيصال الدفع");
    }
  };

  const isPayButtonEnabled = () => {
    if (isUploading || isProcessing || isOpeningGateway || !donationType) return false;

    if (donationType === "international") {
      return selectedInternationalAccount && uploadedFileId;
    } else if (donationType === "local") {
      if (localMethod === "electronic") return true;
      if (localMethod === "bank") return selectedLocalAccount && uploadedFileId;
    }
    
    return false;
  };

  // International Bank Accounts Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await executeProcedure(
          "ImyBmglW7DWznCguP6on2NPvg+wEyBZypFCDrNeFKn0MOCivVpSW2QdNIPSDoSko",
          actionID == 1 ? 1 : 2 
        );
        const internationalData = JSON.parse(response?.decrypted?.InternationalBankAccountsData || "[]");
        setInternationalBankAccountsData(internationalData);
      } catch (error) {
        console.error("Error fetching international bank accounts:", error);
        setInternationalBankAccountsData([]);
      }
    };

    fetchData();
  }, [actionID]);

  // Local Bank Accounts Data
  useEffect(() => {
    const fetchData = async () => {
      if (!officeId || !serviceTypeId || !paymentMethodId) return;
      try {
        const params = `${officeId}#${1}#${serviceTypeId}#${paymentMethodId}`;
        const response = await executeProcedure(
          "sUlbVhUJKwC+dwRdG8NZb+RoLowRJemxolOItXOYojg=",
          params
        );
        
        const localData = JSON.parse(response?.decrypted?.OfficeBanksData || "[]");
        setLocalBankAccountsData(localData);
      } catch (error) {
        console.error("Error fetching local bank accounts:", error);
        setLocalBankAccountsData([]);
      }
    };

    if (officeId && actionID != 12) {
      fetchData();
    } else {
      const fetchZemaAccounts = async () => {
        const params = `1`;
        const response = await executeProcedure(
          "NJ4Pn13/Fmu75bylIUDbD5FLwUl6QiMGGZ0Okh5MPas=",
          params
        );
        setLocalBankAccountsData(JSON.parse(response.decrypted.EbraBankAccountsData));
      };
      fetchZemaAccounts();
    }
  }, [officeId, serviceTypeId, paymentMethodId, actionID]);


  return (
    <div className="flex flex-col h-full">
      {/* Payment Gateway Iframe Modal */}
      <AnimatePresence>
        {showIframe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl w-[90%] max-w-2xl h-[80%] flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">بوابة الدفع الإلكتروني</h3>
                <button
                  onClick={() => setShowIframe(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex-1 relative">
                <iframe
                  key={iframeKey}
                  ref={iframeRef}
                  src={PAYMENT_GATEWAY_URL}
                  className="w-full h-full border-0"
                  title="Payment Gateway"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                  allow="payment"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="p-4 flex-1 overflow-y-auto">
        <p className="text-lg font-semibold mb-6">المكاتب</p>
        <input
          className="flex-1 font-medium p-2 text-[#686868] rounded-md w-full border border-[#B7B7B7] bg-[#DADADA]"
          value={officeName || "لم يتم اختيار مكتب"}
          disabled
        />
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        <p className="text-lg font-semibold mb-6">اختر نوع الدفع السريع</p>
        <div className="flex gap-4">
          <button
            className={`flex-1 py-3 rounded-md font-medium ${
              donationType === "international" ? gradientBtn : grayBtn
            }`}
            onClick={() => {
              setDonationType("international");
              setLocalMethod(null);
              setUploadedFileId("");
              setUploadedFileName("");
              setFileError(""); // Clear file error when changing donation type
              setPaymentMethodId("2"); // Set payment method for international
            }}
          >
            دولي
          </button>
          <button
            className={`flex-1 py-3 rounded-md font-medium ${
              donationType === "local" ? gradientBtn : grayBtn
            }`}
            onClick={() => {
              setDonationType("local");
              setLocalMethod(null);
              setUploadedFileId("");
              setUploadedFileName("");
              setFileError(""); // Clear file error when changing donation type
              setPaymentMethodId(""); // Reset payment method for local
            }}
          >
            محلي
          </button>
        </div>

        {/* International Donation */}
        {donationType === "international" && (
          <div className="mt-6 space-y-4">
            {/* Upload UI with Progress */}
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-700 font-semibold">
                يتم الدفع من خارج ليبيا على الحسابات المخصصة للدفع الدولي مع إرفاق صورة ايصال الدفع
              </p>
            </div>

            <div className="flex items-start gap-4">
              <div
                onClick={handleUploadClick}
                className="w-40 h-40 flex flex-col justify-center items-center gap-2 p-2 border-2 border-dashed border-gray-400 rounded-2xl text-center cursor-pointer relative"
              >
                {isUploading ? (
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#17343B]" />
                    <span className="text-sm mt-2">{uploadProgress}%</span>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-[#17343B] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <ImagePlus className="rounded-md w-10 h-10" color="#17343B" />
                    ارفع ملف
                    {uploadedFileId && (
                      <div className="absolute bottom-2 text-xs text-green-600">
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        تم الرفع
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Uploaded File Info */}
              {uploadedFileName && (
                <div className="flex-1 flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <FileText className="w-8 h-8 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-green-800 text-sm">{uploadedFileName}</p>
                    <p className="text-green-600 text-xs">تم رفع الملف بنجاح</p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              )}
            </div>

            {/* File Error Display */}
            {fileError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{fileError}</span>
              </div>
            )}

            <p className="text-lg font-semibold">حساب</p>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={selectedInternationalAccount}
              onChange={(e) => {
                const selectedValue = e.target.value;
                if (selectedValue) {
                  const account = JSON.parse(selectedValue);
                  setSelectedInternationalAccount(selectedValue);
                  setSelectedInternationalAccountNumber(account.AccountNum);
                } else {
                  setSelectedInternationalAccount("");
                  setSelectedInternationalAccountNumber("");
                }
              }}
              required
            >
              <option value="">اختر الحساب</option>
              {internationalBankAccountsData.map((account, index) => (
                <option key={account.Id || index} value={JSON.stringify(account)}>
                  {account.AccountNum} - {account.BankName}
                </option>
              ))}
              {internationalBankAccountsData.length === 0 && (
                <option value="" disabled>لا توجد حسابات متاحة</option>
              )}
            </select>
          </div>
        )}

        {/* Local Donation */}
        {donationType === "local" && (
          <div className="mt-6 space-y-4">
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-700 font-semibold">يتم الدفع من داخل ليبيا إما عن طريق طرق الدفع الإلكتروني أو عن طريق حوالة بنكية على الحسابات المخصصة </p>
            </div>
            <p className="text-lg font-semibold">طريقة الدفع</p>
            <div className="flex items-center gap-3">
              <label className="flex flex-1 items-center p-3 rounded-md font-medium border-2 border-[#B7B7B7] gap-2">
                <input
                  type="radio"
                  name="localMethod"
                  value="electronic"
                  checked={localMethod === "electronic"}
                  onChange={() => {
                    setLocalMethod("electronic");
                    setUploadedFileId("");
                    setUploadedFileName("");
                    setFileError(""); // Clear file error when changing method
                    setPaymentMethodId("1");
                  }}
                  className="accent-[#17343B] w-5 h-5"
                />
                دفع الكتروني
              </label>
              <label className="flex flex-1 items-center p-3 rounded-md font-medium border-2 border-[#B7B7B7] gap-2">
                <input
                  type="radio"
                  name="localMethod"
                  value="bank"
                  className="accent-[#17343B] w-5 h-5"
                  checked={localMethod === "bank"}
                  onChange={() => {
                    setLocalMethod("bank");
                    setFileError(""); // Clear file error when changing method
                    setPaymentMethodId("2");
                  }}
                />
                حوالة بنكية
              </label>
            </div>

            {/* Bank Transfer */}
            {localMethod === "bank" && (
              <div className="mt-4 space-y-4">
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-700 font-semibold">
                  يتم التحويل على احدى الحسابات المخصصة مع إرفاق صورة ايصال الدفع
                  </p>
                </div>
                {/* Upload UI with Progress */}
                <div className="flex items-start gap-4">
                  <div
                    onClick={handleUploadClick}
                    className="w-40 h-40 flex flex-col justify-center items-center gap-2 p-2 border-2 border-dashed border-gray-400 rounded-2xl text-center cursor-pointer relative"
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-[#17343B]" />
                        <span className="text-sm mt-2">{uploadProgress}%</span>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-[#17343B] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <ImagePlus className="rounded-md w-10 h-10" color="#17343B" />
                        ارفع ملف
                        {uploadedFileId && (
                          <div className="absolute bottom-2 text-xs text-green-600">
                            <CheckCircle className="w-4 h-4 inline mr-1" />
                            تم الرفع
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Uploaded File Info */}
                  {uploadedFileName && (
                    <div className="flex-1 flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <FileText className="w-8 h-8 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium text-green-800 text-sm">{uploadedFileName}</p>
                        <p className="text-green-600 text-xs">تم رفع الملف بنجاح</p>
                      </div>
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  )}
                </div>

                {/* File Error Display */}
                {fileError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{fileError}</span>
                  </div>
                )}

                <p className="text-lg font-semibold">حساب</p>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={selectedLocalAccount}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    if (selectedValue) {
                      const account = JSON.parse(selectedValue);
                      setSelectedLocalAccount(selectedValue);
                      setSelectedLocalAccountNumber(account.AccountNum);
                    } else {
                      setSelectedLocalAccount("");
                      setSelectedLocalAccountNumber("");
                    }
                  }}
                  required
                >
                  <option value="">اختر الحساب</option>
                  {localBankAccountsData.map((account, index) => (
                    <option key={account.Id || index} value={JSON.stringify(account)}>
                      {account.AccountNum} - {account.BankName}
                    </option>
                  ))}
                  {localBankAccountsData.length === 0 && (
                    <option value="" disabled>لا توجد حسابات متاحة</option>
                  )}
                </select>
              </div>
            )}

            {/* Electronic Payment */}
            {localMethod === "electronic" && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-700 font-semibold">
                  يتم الدفع عن طريق احدى طرق الدفع الإلكتروني المحددة في التطبيق
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileRef}
        className="hidden"
        onChange={(e) => {
          if (e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
        accept=".pdf,.png,.jpg,.jpeg,image/*"
      />

      <div className="p-4 border-t">
        <div className="flex items-center justify-between gap-2 text-xl font-semibold mb-6">
          <p>الإجمالي</p>
          <p className="">{Number(totalAmount).toLocaleString()} {currency}</p>
        </div>
        <div className="flex items-center justify-between gap-2 text-xl font-semibold mb-6">
          <p></p>
          <p className=""> {toArabicWord(totalAmount)} {currency}</p>
        </div>
        <button 
          className="w-full flex items-center gap-2 justify-center bg-gradient-to-r from-[#24645E] via-[#18383D] to-[#17343B] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handlePayNow}
          disabled={!isPayButtonEnabled()}
        >
          {isOpeningGateway ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              جاري فتح بوابة الدفع...
            </>
          ) : isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              جاري المعالجة...
            </>
          ) : isUploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              جاري رفع الملف... {uploadProgress}%
            </>
          ) : (
            <>
              <img src={moenyWhite} alt="payment icon" />
              ادفع الآن
            </>
          )}
        </button>
      </div>
      
      <div
        ref={waslRef}
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          width: '800px',
          background: 'white',
          padding: '24px'
        }}
      >
          <ZakatWasl
            officeName={officeName}
            officeId={officeId}
            donationDate={donationDate}
            donationId={donationId}
            donationAmount={totalAmount}
            donationAmountInWords={donationAmountInWords}
            donationPhone={JSON.parse(localStorage.getItem("UserData"))?.Phone || PaymentDesc.split(" - ")[1] || "مجهول"}
            donationName={JSON.parse(localStorage.getItem("UserData"))?.Name || PaymentDesc.split(" - ")[2] || "مجهول"}
            donationType={actionID}
            donationNameForLover={donationNameForLover || "مجهول"}
          />
      </div>
    </div>
  );
};

PayComponent.propTypes = {
  officeName: PropTypes.string,
  officeId: PropTypes.string,
  accountTypeId: PropTypes.string,
  serviceTypeId: PropTypes.string,
  totalAmount: PropTypes.number,
  currency: PropTypes.string,
  actionID:PropTypes.number,
  SubventionType_Id:PropTypes.string,
  Project_Id:PropTypes.string,
  PaymentDesc:PropTypes.string,
  Salla : PropTypes.bool,
  donationNameForLover: PropTypes.string,
  zakatFitrItms: PropTypes.array
};

export default PayComponent;