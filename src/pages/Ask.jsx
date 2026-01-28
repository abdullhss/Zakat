import React, { useEffect, useState } from 'react'
import { DoTransaction, executeProcedure } from '../services/apiServices';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../components/ui/accordion"
import { toast } from 'react-toastify';

const countPerPage = 5;

const Ask = () => {
    const [questionText, setQuestionText] = useState('');
    const [questions, setQuestions] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const userdata = localStorage.getItem("UserData");
    const userID = userdata ? JSON.parse(userdata)?.Id : null;
    
    const totalPages = Math.ceil(totalCount / countPerPage);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await executeProcedure(
                    "N0ChknvX6yV9dlQ8l0KfTfvUFqBtrD9UnnWeW/+KRDI=", 
                    `${userID||0}#${(currentPage-1)*countPerPage + 1}#${countPerPage}`
                );
                console.log(JSON.parse(response.decrypted.GeneralUserQuestionsData));
                
                setTotalCount(Number(response.decrypted.GeneralUserQuestionsCount));
                setQuestions(JSON.parse(response.decrypted.GeneralUserQuestionsData) || []);
            } catch (error) {
                console.error('Error fetching questions:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [currentPage, userID]);

    const handleSendQuestion = async () => {
        if (!questionText.trim()) return;

        try {
            const response = await DoTransaction(
                "DVs4+KfiNQy46+yS057aSQgqdFM/8Jb4nfWSWsSwMrs=",
                `0#${questionText}##${userID}`,
                0
            );
            if(response.success==200){
                toast.success("تم ارسال السؤال بنجاح");
                // Refresh questions after sending new one
                const updatedResponse = await executeProcedure(
                    "N0ChknvX6yV9dlQ8l0KfTfvUFqBtrD9UnnWeW/+KRDI=", 
                    `${userID||0}#${(currentPage-1)*countPerPage + 1}#${countPerPage}`
                );
                setTotalCount(Number(updatedResponse.decrypted.GeneralUserQuestionsCount));
                setQuestions(JSON.parse(updatedResponse.decrypted.GeneralUserQuestionsData) || []);
            }
            // Clear input
            setQuestionText('');
        } catch (error) {
            console.error('Error sending question:', error);
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const renderPaginationButtons = (currentPage, totalPages, handlePageChange) => {
        if (totalPages <= 1) return null;

        const buttons = [];
        const maxVisiblePages = 4;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                buttons.push(
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`text-white text-sm p-0.5 px-3 rounded-md shadow-md flex items-center justify-center ${
                            currentPage === i ? 'opacity-100' : 'opacity-80'
                        }`}
                        style={{
                            background: "linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)",
                        }}
                    >
                        {i}
                    </button>
                );
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 3; i++) {
                    buttons.push(
                        <button
                            key={i}
                            onClick={() => handlePageChange(i)}
                            className={`text-white text-sm p-0.5 px-3 rounded-md shadow-md flex items-center justify-center ${
                                currentPage === i ? 'opacity-100' : 'opacity-80'
                            }`}
                            style={{
                                background: "linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)",
                            }}
                        >
                            {i}
                        </button>
                    );
                }
                buttons.push(<span key="ellipsis" className="px-2">...</span>);
                buttons.push(
                    <button
                        key={totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        className={`text-white text-sm p-0.5 px-3 rounded-md shadow-md flex items-center justify-center ${
                            currentPage === totalPages ? 'opacity-100' : 'opacity-80'
                        }`}
                        style={{
                            background: "linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)",
                        }}
                    >
                        {totalPages}
                    </button>
                );
            } else if (currentPage >= totalPages - 2) {
                buttons.push(
                    <button
                        key={1}
                        onClick={() => handlePageChange(1)}
                        className={`text-white text-sm p-0.5 px-3 rounded-md shadow-md flex items-center justify-center ${
                            currentPage === 1 ? 'opacity-100' : 'opacity-80'
                        }`}
                        style={{
                            background: "linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)",
                        }}
                    >
                        1
                    </button>
                );
                buttons.push(<span key="ellipsis" className="px-2">...</span>);
                for (let i = totalPages - 2; i <= totalPages; i++) {
                    buttons.push(
                        <button
                            key={i}
                            onClick={() => handlePageChange(i)}
                            className={`text-white text-sm p-0.5 px-3 rounded-md shadow-md flex items-center justify-center ${
                                currentPage === i ? 'opacity-100' : 'opacity-80'
                            }`}
                            style={{
                                background: "linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)",
                            }}
                        >
                            {i}
                        </button>
                    );
                }
            } else {
                buttons.push(
                    <button
                        key={1}
                        onClick={() => handlePageChange(1)}
                        className="text-white text-sm p-0.5 px-3 rounded-md shadow-md flex items-center justify-center opacity-80"
                        style={{
                            background: "linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)",
                        }}
                    >
                        1
                    </button>
                );
                buttons.push(<span key="ellipsis1" className="px-2">...</span>);
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    buttons.push(
                        <button
                            key={i}
                            onClick={() => handlePageChange(i)}
                            className={`text-white text-sm p-0.5 px-3 rounded-md shadow-md flex items-center justify-center ${
                                currentPage === i ? 'opacity-100' : 'opacity-80'
                            }`}
                            style={{
                                background: "linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)",
                            }}
                        >
                            {i}
                        </button>
                    );
                }
                buttons.push(<span key="ellipsis2" className="px-2">...</span>);
                buttons.push(
                    <button
                        key={totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        className="text-white text-sm p-0.5 px-3 rounded-md shadow-md flex items-center justify-center opacity-80"
                        style={{
                            background: "linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)",
                        }}
                    >
                        {totalPages}
                    </button>
                );
            }
        }

        return buttons;
    };

    // Function to get status label and styling
    const getStatusLabel = (question) => {
        if (question.Answer && question.Answer.trim() !== '') {
            return {
                text: 'تمت الاجابة',
                className: 'bg-green-100 text-green-800 border border-green-200'
            };
        } else {
            return {
                text: 'معلق',
                className: 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            };
        }
    };

    return (
        <div className="max-w-7xl mx-auto mt-8 p-6">
            {/* Question Input Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-right">اطرح سؤالك</h2>
                <div className="mb-4">
                    <textarea
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        placeholder="اكتب سؤالك هنا..."
                        className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 text-right"
                        dir="rtl"
                    />
                </div>
                <button
                    onClick={handleSendQuestion}
                    disabled={!questionText.trim()}
                    className="w-full bg-gradient-to-l from-[#24645E] to-[#17343B] text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    أرسل السؤال
                </button>
            </div>

            {/* Separator */}
            <hr className="my-8 border-gray-300" />

            {/* Questions List Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-right">الأسئلة</h2>
                
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                        <p className="text-gray-600 mt-2">جاري تحميل الأسئلة...</p>
                    </div>
                ) : questions.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                        {questions.map((question, index) => {
                            const status = getStatusLabel(question);
                            return (
                                <AccordionItem key={question.Id || index} value={`item-${question.Id || index}`}>
                                    <AccordionTrigger className="text-right">
                                        <div className="flex justify-between items-center w-full">
                                            <div className="flex items-center gap-3">
                                                <span className={`text-xs px-2 py-1 rounded-full ${status.className}`}>
                                                    {status.text}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {question.CreateDate || 'تاريخ غير محدد'}
                                                </span>
                                            </div>
                                            <span className="flex-1 text-right mr-4">
                                                {question.Question}
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-right">
                                        <div className="bg-gray-50 p-4 rounded-lg mt-2">
                                            <h4 className="font-semibold text-gray-700 mb-2">الإجابة:</h4>
                                            <p className="text-gray-600">
                                                {question.Answer && question.Answer.trim() !== '' 
                                                    ? question.Answer 
                                                    : 'لا توجد إجابة حتى الآن'}
                                            </p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-600 text-lg">لا توجد أسئلة لعرضها</p>
                    </div>
                )}

                {/* Pagination */}
                {questions.length > 0 && (
                    <div className="flex items-center justify-between px-8 py-6 mt-6">
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={handlePrevPage} 
                                disabled={currentPage <= 1}
                                className="p-2"
                            >
                                <svg 
                                    className={`w-5 h-5 rotate-180 ${currentPage <= 1 ? 'opacity-50' : ''}`}
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                >
                                    <path fillRule="evenodd" d="M10.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L7.414 9H16a1 1 0 110 2H7.414l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                            </button>

                            {renderPaginationButtons(currentPage, totalPages, handlePageChange)}
                            
                            <button 
                                onClick={handleNextPage} 
                                disabled={currentPage >= totalPages}
                                className="p-2"
                            >
                                <svg 
                                    className={`w-5 h-5 ${currentPage >= totalPages ? 'opacity-50' : ''}`}
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                >
                                    <path fillRule="evenodd" d="M10.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L7.414 9H16a1 1 0 110 2H7.414l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Ask;