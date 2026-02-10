import React, { useEffect, useState } from 'react'
import { executeProcedure } from '../services/apiServices';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setShowPopup, setPopupComponent , setPopupTitle} from "../features/PaySlice/PaySlice";
import PayComponent from "../components/PayComponent";
import { useSearchParams } from 'react-router-dom';
const FitrZakat = () => {
  const [isAllowed, setIsAllowed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offices, setOffices] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState("");
  const [fitrZakatTypes, setFitrZakatTypes] = useState([]);
  const [personCounts, setPersonCounts] = useState({});
  const [totals, setTotals] = useState({});
  const [searchParams] = useSearchParams();
  const Officeid = searchParams.get("Officeid");
  const officeName = searchParams.get("officeName");
  const dispatch = useDispatch() ;
  const isOfficeFromRoute = Officeid && officeName;

    const handleOfficeChange = (e) => {
        const id = e.target.value;
        const officeObj = offices.find(o => o.Id == id);

        setSelectedOffice(officeObj || null);

        // Reset
        setPersonCounts({});
        setTotals({});
    };

  const handlePersonCountChange = (typeId, count) => {
    const numericCount = parseInt(count) || 0;
    
    // Find the type to get its AllowedQty
    const type = fitrZakatTypes.find(t => t.Id === typeId);
    const maxAllowed = type?.AllowedQty || 0;
    
    // Ensure count doesn't exceed AllowedQty
    const finalCount = Math.min(numericCount, maxAllowed);
    
    setPersonCounts(prev => ({
      ...prev,
      [typeId]: finalCount
    }));
  };

  const renderOfficeOptions = () => {
    return offices.map((office) => (
      <option
        key={office.Id}
        value={office.Id}
        className="bg-white text-black"
      >
        {office.OfficeName}
      </option>
    ));
  };

  // Calculate totals whenever personCounts or fitrZakatTypes change
  useEffect(() => {
    if (fitrZakatTypes.length > 0) {
      const newTotals = {};
      let grandTotal = 0;

      fitrZakatTypes.forEach(type => {
        const count = personCounts[type.Id] || 0;
        const typeTotal = count * type.ItemValue;
        newTotals[type.Id] = typeTotal;
        grandTotal += typeTotal;
      });

      newTotals.grandTotal = grandTotal;
      setTotals(newTotals);
    }
  }, [personCounts, fitrZakatTypes]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await executeProcedure(
          "Sce1eFOykJx+KA+4UIHNzvKIDq08wQibfcVg5Av3Iug=",
          "1#1"
        );

        const data = JSON.parse(response.decrypted.ZakatFitrSettingsData)[0];

        const from = new Date(data.FromDate);
        const to = new Date(data.ToDate);
        const now = new Date();

        if (now >= from && now <= to) {
          setIsAllowed(true);
        } else {
          setIsAllowed(false);
        }
      } catch (err) {
        console.error(err);
        setIsAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    fetchdata();
  }, []);

  useEffect(() => {
    const fetchdata = async () => {
      const response = await executeProcedure(
        "mdemtAbueh2oz+k6MjjaFaOfTRzNK4XQQy0TBhCaV0Y=",
        "0"
      );
      const officesData = JSON.parse(response.decrypted.OfficesData);
      setOffices(officesData);
      
      // If Officeid is in URL, pre-select the office
      if (Officeid && officeName) {
        const officeObj = officesData.find(o => o.Id == Officeid);
        if (officeObj) {
          setSelectedOffice(officeObj);
        }
      }
    };

    fetchdata();
  }, [Officeid, officeName]);

  useEffect(() => {
    const fetchdata = async () => {
      if (selectedOffice?.Id) {
        const response = await executeProcedure(
          "2u/Nn3DLlJ8eyKA5WyGE78euJIBOav2KZMzkAuo7aQc=",
          `${selectedOffice?.Id}#1#100`
        );
        const data = JSON.parse(response.decrypted.ZakatFitrItemsData);
        
        // Remap the data to match the expected structure
        const remappedData = (data || []).map(item => ({
          Id: item.ItemId,          
          ItemName: item.ItemName,  
          ItemValue: item.ItemValue, 
          AllowedQty: item.AllowedQty
        }));
        
        setFitrZakatTypes(remappedData);
      }
    };
  
    fetchdata();
  }, [selectedOffice]);

  const buildPaymentDescription = () => {
  const lines = [];

  fitrZakatTypes.forEach(type => {
    const count = personCounts[type.Id];
    if (count > 0) {
      lines.push(`عدد ${count} من صنف "${type.ItemName}"`);
    }
  });

  return lines.join(" - ");
};


  const handlePayment = () => {
    const zakatFitrItms = fitrZakatTypes.map(type => ({...type , quantity: personCounts[type.Id]}));
    console.log(selectedOffice);
      const paymentDesc = buildPaymentDescription();
      
      // Use office name from URL if available, otherwise from selectedOffice
      const finalOfficeName = isOfficeFromRoute ? officeName : selectedOffice.OfficeName;
      const finalOfficeId = isOfficeFromRoute ? Officeid : selectedOffice.Id;
      
        dispatch(setPopupTitle("الدفع"))
        dispatch(setPopupComponent(
          <PayComponent
          officeName={finalOfficeName}
          PaymentDesc={paymentDesc}
          officeId={finalOfficeId}
          totalAmount={totals.grandTotal}
          actionID={11}
          currency="دينار"
          zakatFitrItms = {zakatFitrItms}
          />
        ));
        dispatch(setShowPopup(true))
    
  };

  if (loading) return <div className="text-center py-8">جاري التحميل...</div>;

  if (!isAllowed) {
    return (
      <div className="text-red-600 text-center text-2xl font-bold mt-10">
        هذا ليس الوقت المحدد لاخراج الزكاة
      </div>
    );
  }

  return (
    <div
        style={{
            backgroundImage: "url('/background pattern.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
        }}
        className='min-h-screen'
    >
      
        <div className='w-full flex justify-center items-center '>
          <span className="text-2xl w-full text-center mt-8 bg bg-gradient-to-r from-[#24645E] via-[#18383D] to-[#17343B] bg-clip-text text-transparent font-semibold">
          المقدارُ بالصاعِ النبويِّ لجميعِ الأصنافِ هو كيلوجرامان ونصفُ الكيلوجرام (2.5 كجم).
          </span>
        </div>
        <div className="max-w-4xl mx-auto p-6"
        >
        {/* Office Selection */}
        <div className="mb-8">
            <label className="block text-lg font-semibold mb-3 text-right">
            {isOfficeFromRoute ? "المكتب المحدد" : "اختر المكتب"}
            </label>
            {isOfficeFromRoute ? (
              <div className="w-full border-2 border-gray-300 rounded-lg p-3 bg-gray-50 font-semibold text-right">
                {officeName || selectedOffice?.OfficeName}
                <p className="text-sm text-gray-600 mt-2 font-normal">
                  تم تحديد هذا المكتب مسبقاً. يمكنك اختيار أنواع زكاة الفطر والمبالغ.
                </p>
              </div>
            ) : (
              <select
              value={selectedOffice?.Id || ""}
              onChange={handleOfficeChange}
              className="w-full border-2 border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold text-right"
              disabled={loading}
              >
              <option className="bg-white text-black" value="">
                  {loading ? "جاري تحميل المكاتب..." : "اختر مكتب"}
              </option>
              {renderOfficeOptions()}
              </select>
            )}
        </div>

        {/* Zakat Types */}
        {selectedOffice && fitrZakatTypes.length > 0 && (
            <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">زكاة الفطر</h2>
            
            {fitrZakatTypes.map((type) => (
                <div 
                key={type.Id} 
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    {/* Type Info */}
                    <div className="text-center md:text-right">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {type.ItemName}
                    </h3>
                    <p className="text-lg text-emerald-600 font-bold mt-1">
                        {type.ItemValue} دينار
                    </p>
                    </div>

                    {/* Person Count Input */}
                    <div className="text-center">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        عدد الأشخاص
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={type.AllowedQty || 0}
                        value={personCounts[type.Id] || ''}
                        onChange={(e) => handlePersonCountChange(type.Id, e.target.value)}
                        className="w-32 mx-auto border border-gray-300 rounded-lg p-2 text-center focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        placeholder="0"
                      />
                      {type.AllowedQty > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          الحد الأقصى: {type.AllowedQty}
                        </p>
                      )}
                    </div>

                    {/* Type Total */}
                    <div className="text-center md:text-left">
                    <p className="text-sm text-gray-600">المجموع</p>
                    <p className="text-xl font-bold text-green-600">
                        {totals[type.Id] || 0} دينار
                    </p>
                    </div>
                </div>
                </div>
            ))}

            {/* Grand Total */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-6">
                <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-gray-800">المجموع الكلي:</span>
                <span className="text-2xl font-bold text-emerald-600">
                    {totals.grandTotal || 0} دينار
                </span>
                </div>
            </div>

            {/* Payment Button */}
            <button
                onClick={handlePayment}
                disabled={!totals.grandTotal || totals.grandTotal === 0}
                className="w-full py-4 px-6 bg-gradient-to-l from-[#17343B] via-[#18383D] to-[#24645E] text-white text-lg font-semibold rounded-lg hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
                الدفع
            </button>
            </div>
        )}

        {selectedOffice && fitrZakatTypes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
            لا توجد أنواع زكاة متاحة لهذا المكتب
            </div>
        )}
        </div>
    </div>

  );
};

export default FitrZakat;