import React, { useState, useRef } from 'react';
import { ImagePlus, Loader2, CheckCircle, FileText, AlertCircle } from "lucide-react";
import { DoTransaction } from '../services/apiServices';
import { HandelFile } from './HandelFile';
import { useDispatch } from 'react-redux';
import { setShowPopup} from "../features/PaySlice/PaySlice";
import { toast } from 'react-toastify';

const CreateCampaign = () => {
  // File upload states (copied from PayComponent)
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileId, setUploadedFileId] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const fileRef = useRef(null);
  const dispatch = useDispatch() ;
  // Form states for the 4 inputs
  const [campaignData, setCampaignData] = useState({
    description: "",
    name: "",
    targetAmount: "",
    type: ""
  });

  // File upload handlers (copied from PayComponent)
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

      

      if (result.status === 200) {
        setUploadedFileId(result.id);
        setUploadedFileName(file.name);
        
      } else {
        console.error("Upload failed:", result.error);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };
  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // For targetAmount, only allow numbers
    if (name === "targetAmount") {
      // Remove any non-numeric characters except decimal point
      const numericValue = value.replace(/[^\d.]/g, '');
      // Ensure only one decimal point
      const finalValue = numericValue.replace(/(\..*)\./g, '$1');
      
      setCampaignData(prev => ({
        ...prev,
        [name]: finalValue
      }));
    } else {
      setCampaignData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Prevent non-numeric input for target amount
  const handleKeyPress = (e) => {
    if (e.target.name === "targetAmount") {
      // Allow numbers, decimal point, and control keys
      if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
        e.preventDefault();
      }
    }
  };

  // Check if all fields are filled
  const isFormValid = () => {
    return (
      campaignData.description.trim() !== "" &&
      campaignData.description.length <= 500 &&
      campaignData.name.trim() !== "" &&
      campaignData.targetAmount.trim() !== "" &&
      campaignData.type.trim() !== "" &&
      uploadedFileId !== ""
    );
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (campaignData.description.length > 500) {
      toast.error("وصف الحملة يجب أن يكون أقل من 500 حرف");
      return;
    }
    if (!isFormValid()) {
      return;
    }

    // Here you would typically send the data to your API
    
    
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;
    const userData = localStorage.getItem("UserData") 
    const GeneralUser_Id = userData ? JSON.parse(userData).Id : null;
    const response = await DoTransaction("D/IZgGJ8YRlhRUmX4yZa/w==" , 
        `0#${campaignData.name}#${campaignData.description}#${campaignData.type}#${campaignData.targetAmount}#${campaignData.targetAmount}#${formattedDate}#False#default#True#${GeneralUser_Id}#${uploadedFileId}`
        // Id#CampaignName#CampaignDesc#CampaignType#WantedAmount#CampaignRemainingAmount#CreatedDate#IsApproved#ApprovedDate#IsActive#GeneralUser_Id#CampaignPhotoID
    )
    
    

    // Reset form after submission
    toast.success("تم انشاء الحملة بنجاح")
    setCampaignData({
      description: "",
      name: "",
      targetAmount: "",
      type: ""
    });
    dispatch(setShowPopup(false ))
    setUploadedFileId("");
    setUploadedFileName("");
    setFileError("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload Section (copied from PayComponent) */}
      <div className="space-y-4">
        <label className="block text-lg font-semibold text-[#17343B]">رفع صورة الحملة</label>
        
        <div className="flex items-start gap-4">
          <div
            onClick={handleUploadClick}
            className="w-40 h-40 flex flex-col justify-center items-center gap-2 p-2 border-2 border-dashed border-gray-400 rounded-2xl text-center cursor-pointer relative hover:border-[#17343B] transition-colors"
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
                <span className="text-sm">ارفع ملف</span>
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

        <p className="text-sm text-gray-500">الملفات المسموحة: PDF, PNG, JPG, JPEG</p>
      </div>

      {/* Hidden file input */}
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

      {/* 4 Inputs in one column - all as text inputs */}
      <div className="space-y-4">
        {/* وصف الحملة (Campaign Description) - Changed to text input */}
        <div>
          <label className="block font-bold text-gray-700 mb-2">وصف الحملة</label>
          <input
            type="text"
            name="description"
            value={campaignData.description}
            onChange={handleInputChange}
            placeholder="أدخل وصف الحملة..."
            maxLength={500}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17343B] focus:border-transparent"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            {campaignData.description.length} / 500 حرف
          </p>
        </div>

        {/* اسم الحملة (Campaign Name) */}
        <div>
          <label className="block font-bold text-gray-700 mb-2">اسم الحملة</label>
          <input
            type="text"
            name="name"
            value={campaignData.name}
            onChange={handleInputChange}
            placeholder="أدخل اسم الحملة..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17343B] focus:border-transparent"
            required
          />
        </div>

        {/* المبلغ المستهدف (Target Amount) - Numeric only */}
        <div>
          <label className="block font-bold text-gray-700 mb-2">المبلغ المستهدف</label>
          <input
            type="text"
            name="targetAmount"
            value={campaignData.targetAmount}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="أدخل المبلغ المستهدف..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17343B] focus:border-transparent"
            required
            inputMode="numeric"
          />
        </div>

        {/* نوع الحملة (Campaign Type) - Changed to text input */}
        <div>
          <label className="block font-bold text-gray-700 mb-2">نوع الحملة</label>
          <input
            type="text"
            name="type"
            value={campaignData.type}
            onChange={handleInputChange}
            placeholder="أدخل نوع الحملة..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17343B] focus:border-transparent"
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-[#24645E] via-[#18383D] to-[#17343B] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!isFormValid() || isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin inline ml-2" />
            جاري رفع الملف... {uploadProgress}%
          </>
        ) : (
          "إنشاء الحملة"
        )}
      </button>
    </form>
  );
}

export default CreateCampaign;