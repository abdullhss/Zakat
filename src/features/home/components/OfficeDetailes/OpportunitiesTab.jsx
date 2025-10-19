/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from 'react'
import { executeProcedure } from '../../../../services/apiServices';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DonationCard from '../../../../components/DonationCard';
import { motion, AnimatePresence } from "framer-motion";

const OpportunitiesTab = ({Officeid}) => {
    const [filters, setFilters] = useState([]);
    const [activeFilter, setActiveFilter] = useState(0);
    const [activeTab, setActiveTab] = useState('current');
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const [projects, setProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalProjectsCount, setTotalProjectsCount] = useState(0);
    const [loading, setLoading] = useState(false);
    
    const filtersContainerRef = useRef(null);
    const countPerPage = 6;

    // Stored procedures
    const STORED_PROCEDURES = {
        current: "phjR2bFDp5o0FyA7euBbsp/Ict4BDd2zHhHDfPlrwnk=",
        completed: "Wu4tssLPA6NegogQvjcHM44/NbLjK6C1NzyGHbE9G1E="
    };

    // Fetch filters on component mount
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const response = await executeProcedure(
                    "CjSj0j5kAa/aqk9LMpWvCavGukOw8WsDmvfzbXkXVaI=",
                    "1#100"
                )
                
                console.log("Filters response:", response)
                
                if (response && response.decrypted && response.decrypted.SubventionTypesData) {
                    const parsedFilters = JSON.parse(response.decrypted.SubventionTypesData)
                    console.log("Parsed filters:", parsedFilters)
                    
                    const allFilter = { Id: 0, SubventionTypeName: "الكل" }
                    const filterObjects = [allFilter, ...parsedFilters]
                    
                    setFilters(filterObjects)
                    setActiveFilter(0)
                }
            } catch (error) {
                console.error("Error fetching filters:", error)
            }
        }
    
        fetchFilters()
    }, [])

    // Fetch projects when tab, filter, or page changes
    useEffect(() => {
        if (Officeid) {
            fetchProjectsData();
        }
    }, [activeTab, activeFilter, currentPage, Officeid])

    const fetchProjectsData = async () => {
        setLoading(true);
        try {
            const StartNum = (currentPage - 1) * countPerPage + 1;
            const SubventionTypeId = activeFilter === 0 ? 0 : activeFilter;
            
            console.log("Fetching with params:", {
                Officeid,
                SubventionTypeId,
                StartNum,
                countPerPage,
                activeTab,
                procedure: STORED_PROCEDURES[activeTab]
            });

            const response = await executeProcedure(
                STORED_PROCEDURES[activeTab],
                `${Officeid}#${SubventionTypeId}#${'S'}#${StartNum}#${countPerPage}`
            );
            console.log(`${Officeid}#${SubventionTypeId}#${'S'}#${StartNum}#${countPerPage}`);
            
            console.log("Projects response:", response);
            
            // Handle case where response.decrypted might be undefined
            if (response && response.decrypted) {
                // Parse the ProjectsData from string to array
                const projectsDataString = response.decrypted.ProjectsData || "[]";
                const projectsData = JSON.parse(projectsDataString);
                
                // Get total count from ProjectsCount
                const totalCount = parseInt(response.decrypted.ProjectsCount || "0");
                
                setProjects(projectsData);
                setTotalProjectsCount(totalCount);
                setTotalPages(Math.ceil(totalCount / countPerPage));
                
                console.log("Parsed projects:", projectsData);
                console.log("Total count:", totalCount);
            } else {
                // Handle case where response.decrypted is undefined
                console.warn("No decrypted data in response:", response);
                setProjects([]);
                setTotalProjectsCount(0);
                setTotalPages(0);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
            setProjects([]);
            setTotalProjectsCount(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    // Check scroll position for arrows visibility
    const checkScrollPosition = () => {
        const container = filtersContainerRef.current;
        if (container) {
            setShowLeftArrow(container.scrollLeft > 0);
            setShowRightArrow(container.scrollLeft + container.clientWidth < container.scrollWidth - 1);
        }
    };

    // Scroll functions
    const scrollLeft = () => {
        if (filtersContainerRef.current) {
            filtersContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (filtersContainerRef.current) {
            filtersContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    // Handle filter change
    const handleFilterChange = (filterId) => {
        setActiveFilter(filterId);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1); // Reset to first page when tab changes
    };

    // Pagination handlers
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Check scroll position on mount and when filters change
    useEffect(() => {
        checkScrollPosition();
        const container = filtersContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScrollPosition);
            window.addEventListener('resize', checkScrollPosition);
        }
        
        return () => {
            if (container) {
                container.removeEventListener('scroll', checkScrollPosition);
            }
            window.removeEventListener('resize', checkScrollPosition);
        };
    }, [filters]);

    return (
        <div className='mt-6'>
            {/* Tabs Section */}
            <div className='flex items-center justify-between w-full px-8 mt-2 gap-4'>
                <button 
                    onClick={() => handleTabChange('current')}
                    className={`flex-1 py-3 rounded-md transition-all duration-300 ${
                        activeTab === 'current' 
                            ? 'text-white shadow-lg' 
                            : 'text-[#878787] bg-[#C9C9C9]'
                    }`}
                    style={{
                        background: activeTab === 'current' 
                            ? 'linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)' 
                            : ''
                    }}
                >
                    فرص التبرعات الحالية
                </button>
                <button 
                    onClick={() => handleTabChange('completed')}
                    className={`flex-1 py-3 rounded-md transition-all duration-300 ${
                        activeTab === 'completed' 
                            ? 'text-white shadow-lg' 
                            : 'text-[#878787] bg-[#C9C9C9]'
                    }`}
                    style={{
                        background: activeTab === 'completed' 
                            ? 'linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)' 
                            : ''
                    }}
                >
                    فرص التبرعات المكتملة
                </button>
            </div>

            {/* Filters with Scroll */}
            <div className='relative mt-6 mx-8 border-b border-[#878787]'>
                {/* Left Arrow - Only show when there's content to scroll to */}
                    <button
                        onClick={scrollLeft}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
                    >
                        <ChevronLeft className="w-5 h-5 text-[#17343B]" />
                    </button>
                
                {/* Right Arrow - Only show when there's content to scroll to */}
                    <button
                        onClick={scrollRight}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
                    >
                        <ChevronRight className="w-5 h-5 text-[#17343B]" />
                    </button>

                {/* Filters Container */}
                <div
                    ref={filtersContainerRef}
                    onScroll={checkScrollPosition}
                    className="flex items-center gap-8 overflow-x-auto scrollbar-hide py-2 px-4"
                    style={{ 
                        scrollbarWidth: 'none', 
                        msOverflowStyle: 'none',
                        scrollBehavior: 'smooth'
                    }}
                >
                    {filters.map((filter) => (
                        <span
                            key={filter.Id}
                            onClick={() => handleFilterChange(filter.Id)}
                            className={`relative whitespace-nowrap py-1 cursor-pointer transition-colors duration-300 flex-shrink-0 min-w-[calc(25%-1.5rem)] text-center ${
                                activeFilter === filter.Id 
                                    ? 'text-[#17343B] font-bold' 
                                    : 'text-[#878787] font-bold hover:text-[#17343B]/70'
                            }`}
                        >
                            {filter.SubventionTypeName}
                            {activeFilter === filter.Id && (
                                <span 
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#215A57] animate-[slideIn_0.3s_ease-out]" 
                                />
                            )}
                        </span>
                    ))}
                </div>
            </div>

            {/* Projects Content */}
            <div className="px-8 py-6">
                {loading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600">جاري التحميل...</p>
                    </div>
                ) : projects.length > 0 ? (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab + '-' + activeFilter + '-' + currentPage}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {projects.map((project, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <DonationCard
                                        cantPay={activeTab === 'current' ? false : true}
                                        showBtn={project.AllowZakat}
                                        collected={(project.WantedAmount - project.RemainingAmount).toFixed(2)}
                                        goal={project.WantedAmount.toFixed(2)}
                                        description={project.Description}
                                        image={`https://framework.md-license.com:8093/ZakatImages/${project.PhotoName}.jpg`}
                                        title={project.Name}
                                        payNowLink={`/project?data=${JSON.stringify({...project , actionID:0})}`}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 text-lg">
                            لا توجد {activeTab === 'current' ? 'فرص تبرعات حالية' : 'فرص تبرعات مكتملة'} 
                            {activeFilter !== 0 && ` في فئة ${filters.find(f => f.Id === activeFilter)?.SubventionTypeName}`}
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!loading && totalProjectsCount > 0 && totalPages > 1 && (
                <div className="flex items-center justify-between px-8 py-6">
                    <div className="flex items-center gap-2 mx-auto">
                        <button 
                            onClick={handlePrevPage} 
                            disabled={currentPage <= 1}
                            className={`p-2 ${currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 rounded'}`}
                        >
                            <svg 
                                className={`w-5 h-5 rotate-180 ${currentPage <= 1 ? 'opacity-50' : 'text-[#17343B]'}`}
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                            >
                                <path fillRule="evenodd" d="M10.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L7.414 9H16a1 1 0 110 2H7.414l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {/* Page numbers */}
                        <div className="flex items-center gap-1">
                            {[...Array(totalPages)].map((_, index) => {
                                const pageNumber = index + 1;
                                // Show only limited page numbers for better UX
                                if (
                                    pageNumber === 1 || 
                                    pageNumber === totalPages || 
                                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => handlePageChange(pageNumber)}
                                            className={`text-sm py-1 px-3 rounded-md transition-all ${
                                                currentPage === pageNumber 
                                                    ? 'text-white shadow-lg' 
                                                    : 'text-[#17343B] bg-gray-100 hover:bg-gray-200'
                                            }`}
                                            style={{
                                                background: currentPage === pageNumber 
                                                    ? "linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)"
                                                    : ''
                                            }}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                } else if (
                                    pageNumber === currentPage - 2 ||
                                    pageNumber === currentPage + 2
                                ) {
                                    return <span key={pageNumber} className="px-1 text-gray-500">...</span>;
                                }
                                return null;
                            })}
                        </div>
                        
                        <button 
                            onClick={handleNextPage} 
                            disabled={currentPage >= totalPages}
                            className={`p-2 ${currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 rounded'}`}
                        >
                            <svg 
                                className={`w-5 h-5 ${currentPage >= totalPages ? 'opacity-50' : 'text-[#17343B]'}`}
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
    )
}

export default OpportunitiesTab