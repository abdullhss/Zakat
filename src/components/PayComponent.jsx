import { ImagePlus, Loader2, CheckCircle, FileText, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import PropTypes from 'prop-types';
import moenyWhite from "../public/SVGs/moneyWhite.svg";
import { executeProcedure , DoTransaction} from "../services/apiServices";
import { HandelFile } from "./HandelFile";
import {setShowPopup , closeAllPopups} from "../features/PaySlice/PaySlice"
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import cartReducer , {setCartData} from "../features/CartSlice/CartSlice";
import { useNavigate } from "react-router-dom";
const PayComponent = ({
  officeName = "",
  officeId = "",
  accountTypeId = "",
  serviceTypeId = "",
  totalAmount = 0,
  currency = "$",
  actionID="1",
  SubventionType_Id="0",
  Project_Id="0",
  PaymentDesc="",
  Salla=false
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
  const [fileError, setFileError] = useState(""); // New state for file error
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate() ;
  const gradientBtn =
    "bg-gradient-to-r from-[#24645E] via-[#18383D] to-[#17343B] text-white";
  const grayBtn = "bg-[#C9C9C9] text-black";

  const handleUploadClick = () => {
    if (fileRef.current && !isUploading) {
      fileRef.current.click();
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setFileError("يرجى رفع ملف من النوع: PDF, PNG, JPG, JPEG فقط");
      return;
    }

    // Clear any previous errors
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
        SessionID: "", // You'll need to provide the actual SessionID
        onProgress: (progress) => {
          setUploadProgress(progress);
        }
      });

      console.log("Upload response:", result);

      if (result.status === 200) {
        setUploadedFileId(result.id);
        setUploadedFileName(file.name);
        console.log("File uploaded successfully with ID:", result.id);
      } else {
        console.error("Upload failed:", result.error);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const callPaymentProcedure = async () => {
    if (!uploadedFileId && (donationType === "international" || localMethod === "bank")) {
      return;
    }

    setIsProcessing(true);

    try {
      // Determine payment way and method based on selection
      let paymentWayId = "0";
      let paymentMethodIdValue = "0";

      if (donationType === "international") {
        paymentWayId = "1"; // دولي
        paymentMethodIdValue = "0"; // حوالة بنكية
      } else if (donationType === "local") {
        paymentWayId = "2"; // محلي
        paymentMethodIdValue = localMethod === "electronic" ? "1" : "2"; // 1: دفع الكتروني, 2: حوالة بنكية
      }

      // Get current date in YYYY-MM-DD format
      const currentDate = new Date();
      const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;

      // Prepare account number based on selection
      let accountNum = "";
      let bankId = "0";

      if (donationType === "international") {
        accountNum = selectedInternationalAccountNumber;
        // For international, Bank_Id should be the actual bank ID from the selected account
        const selectedAccount = JSON.parse(selectedInternationalAccount);
        bankId = selectedAccount.BankId || selectedAccount.Id || "0";
      } else if (donationType === "local" && localMethod === "bank") {
        accountNum = selectedLocalAccountNumber;
        // For local, Bank_Id should be the bank account ID
        const selectedAccount = JSON.parse(selectedLocalAccount);
        bankId = selectedAccount.Id || "0";
      }

      // Prepare parameters according to the specified format
      const params = [
        "0", // Id
        formattedDate, // PaymentDate
        PaymentDesc, // PaymentDesc (فاضي)
        totalAmount.toString(), // PaymentValue
        actionID, // Action_Id (زكاة)
        paymentWayId, // PaymentWay_Id
        paymentMethodIdValue, // PaymentMethod_Id
        SubventionType_Id, // SubventionType_Id
        Project_Id, // Project_Id
        officeId || "0", // Office_Id
        bankId, // Bank_Id - fixed to use proper bank ID
        accountNum, // AccountNum - now properly set
        uploadedFileId || "", // AttachmentPhotoName
        "False", // IsApproved
        JSON.parse(localStorage.getItem("UserData")).Id || 0 // GeneralUser_Id
      ].join("#");

      console.log("Calling procedure with params:", params);

      const response = await DoTransaction("rCSWIwrXh3HGKRYh9gCA8g==", params);
      console.log("payment response:", response);

      if (response?.success) {
        // Reset form or navigate to success page
        // Reset all states
        setDonationType(null);
        setLocalMethod(null);
        setSelectedInternationalAccount("");
        setSelectedLocalAccount("");
        setSelectedInternationalAccountNumber("");
        setSelectedLocalAccountNumber("");
        setUploadedFileId("");
        setUploadedFileName("");
        setFileError(""); // Clear file error on success
        toast.success("تم الدفع بنجاح");
        dispatch(setShowPopup(false));
        dispatch(closeAllPopups());
        
        
        if(Salla && JSON.parse(localStorage.getItem("UserData")).Id){
            const handleFetchCartData =   async () => {
              const data = await executeProcedure(
                "ErZm8y9oKKuQnK5LmJafNAUcnH+bSFupYyw5NcrCUJ0=",
                JSON.parse(localStorage.getItem("UserData")).Id
              );
              dispatch(setCartData(data.decrypted));
            } 
            handleFetchCartData();
            navigate("/")
        }
          
      } else {
        console.log("error payment");
      }

    } catch (error) {
      console.error("Error calling payment procedure:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayNow = () => {
    // For electronic payment without file upload
    if (donationType === "local" && localMethod === "electronic") {
      callPaymentProcedure();
    } 
    // For bank transfers with file upload
    else if (uploadedFileId) {
      callPaymentProcedure();
    } 
    // For bank transfers without file upload yet
    else if (donationType === "international" || localMethod === "bank") {
        console.log("error payment");
    }
    // If no donation type selected
    else if (!donationType) {
        console.log("error payment");
    }
  };

  // Check if pay button should be enabled
  const isPayButtonEnabled = () => {
    if (isUploading || isProcessing || !donationType) return false;

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
          "0"
        );
        const internationalData = JSON.parse(response?.decrypted?.InternationalBankAccountsData || "[]");
        setInternationalBankAccountsData(internationalData);
      } catch (error) {
        console.error("Error fetching international bank accounts:", error);
        setInternationalBankAccountsData([]);
      }
    };

    fetchData();
  }, []);

  // Local Bank Accounts Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = `${officeId}#${1}#${serviceTypeId}#${paymentMethodId}`;
        const response = await executeProcedure(
          "sUlbVhUJKwC+dwRdG8NZb+RoLowRJemxolOItXOYojg=",
          params
        );
        console.log("Local bank accounts params:", params);
        console.log("Local bank accounts response:", response);
        
        const localData = JSON.parse(response?.decrypted?.OfficeBanksData || "[]");
        console.log("Local bank accounts data:", localData);
        
        setLocalBankAccountsData(localData);
      } catch (error) {
        console.error("Error fetching local bank accounts:", error);
        setLocalBankAccountsData([]);
      }
    };

    if (officeId && serviceTypeId && paymentMethodId) {
      fetchData();
    }
  }, [officeId, serviceTypeId, paymentMethodId]);

  const formatAccountNumber = (accountNum) => {
    if (!accountNum) return "";
    if (accountNum.length <= 8) return accountNum;
    return `****${accountNum.slice(-4)}`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex-1 overflow-y-auto">
        <p className="text-lg font-semibold mb-6">المكاتب</p>
        <input
          className="flex-1 font-medium p-2 text-[#686868] rounded-md w-full border border-[#B7B7B7] bg-[#DADADA]"
          value={officeName || "لم يتم اختيار مكتب"}
          disabled
        />
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        <p className="text-lg font-semibold mb-6">اختر نوع التبرع السريع</p>
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
                  {account.AccountNum}
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
                      {account.AccountNum}
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
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-700 font-semibold">سيتم توجيهك إلى بوابة الدفع الإلكتروني</p>
                <p className="text-blue-600 text-sm mt-2">ستقوم بإتمام عملية الدفع عبر بوابة الدفع الآمنة</p>
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
          <p className="">{totalAmount} {currency}</p>
        </div>
        <button 
          className="w-full flex items-center gap-2 justify-center bg-gradient-to-r from-[#24645E] via-[#18383D] to-[#17343B] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handlePayNow}
          disabled={!isPayButtonEnabled()}
        >
          {isProcessing ? (
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
  Salla : PropTypes.bool
};

export default PayComponent;