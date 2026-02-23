import React, { useState, useEffect } from 'react';
import { DoTransaction, executeProcedure } from '../services/apiServices';
import { Trash2, Loader2 } from 'lucide-react';
import Diamond from '../components/Diamond'; // Adjust path as needed
import { toast } from 'react-toastify';

const Bakyat = () => {
  const [bakyat, setBakyat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const countPerPage = 10; // As per API call (10 items per page)

  const totalPages = Math.ceil(totalCount / countPerPage);
  const fetchBakyat = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = JSON.parse(localStorage.getItem("UserData"))?.Id;
      if (!userId) {
        setError("يجب تسجيل الدخول أولاً");
        setLoading(false);
        return;
      }

      // API expects: UserId#PageIndex#PageSize
      // Using currentPage+1 because the API might use 1‑based indexing
      const response = await executeProcedure(
        "m27c6zyFakHVikZdL4D7BQ==",
        `${userId}#${currentPage + 1}#${countPerPage}`
      );

      // Parse the returned data
      const data = response?.decrypted?.BaqiatData
        ? JSON.parse(response.decrypted.BaqiatData)
        : [];
      const count = Number(response?.decrypted?.BaqiatCount) || 0;

      setBakyat(data);
      setTotalCount(count);
    } catch (err) {
      console.error('Error fetching Bakyat:', err);
      setError('حدث خطأ أثناء تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBakyat();
  }, [currentPage]); // Re-fetch when page changes

  const handleDelete = async (id) => {
    const response = await DoTransaction(
        "evz/MM/BXvFvUAREbBE+Rg==", 
        `${id}` , 
        2 , 
        "Id"
    );
    if(response.success == 200){
        toast.success("تم حذف الباقية بنجاح");
        fetchBakyat();
    } else {
        toast.error("فشل في حذف الباقية");
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="relative overflow-hidden min-h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/background pattern.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
          }}
        />
        <div className="text-center z-10">
          <Loader2 className="w-12 h-12 animate-spin text-[#18383D] mx-auto" />
          <p className="mt-4 text-[#18343A]">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative overflow-hidden min-h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/background pattern.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
          }}
        />
        <div className="text-center z-10 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background pattern */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/background pattern.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
        }}
      />

      <div className="relative z-10 mx-auto px-4 flex flex-col gap-4 py-20 md:py-28">
        {/* Header with diamond */}
        <div className="flex items-center justify-between pl-4 md:pl-12">
          <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-lg md:text-2xl px-4 md:px-8 py-2">
            <Diamond className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-1/4 shadow-xl" />
            الباقيات الصالحات
          </div>
        </div>

        {/* Main content card */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          {bakyat.length === 0 ? (
            <p className="text-center text-gray-500 py-10">لا توجد باقيات صالحات حالياً</p>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الوصف</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المبلغ</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نوع التبرع</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المكتب</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">البنك</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bakyat.map((item, index) => (
                      <tr key={item.Id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(currentPage - 1) * countPerPage + index + 1}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(item.PaymentDate).toLocaleDateString('ar-EG')}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.PaymentDesc || '—'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.PaymentValue} د.ل
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.ActionName}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.OfficeName}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.BankName}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => handleDelete(item.Id)}
                            className="text-[#F04F32] border-2 border-[#F04F32] rounded-md px-3 py-1 text-sm font-medium hover:bg-[#F04F32] hover:text-white transition-colors flex items-center gap-1"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                            حذف
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-md border border-[#18383D] text-[#18383D] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#18383D] hover:text-white transition-colors"
                  >
                    السابق
                  </button>
                  <span className="px-4 py-2 text-[#18383D]">
                    صفحة {currentPage} من {totalPages}
                  </span>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-md border border-[#18383D] text-[#18383D] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#18383D] hover:text-white transition-colors"
                  >
                    التالي
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bakyat;