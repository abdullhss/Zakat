import React, { useState, useEffect } from 'react'
import { executeProcedure } from '../services/apiServices';

const Bakyat = () => {
    const [bakyat, setBakyat] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const countPerPage = 6;
    // const totalPages = Math.ceil(totalCount / countPerPage);

    useEffect(() => {
        const fetchBakyat = async () => {
            const response = await executeProcedure("m27c6zyFakHVikZdL4D7BQ==", `${JSON.parse(localStorage.getItem("UserData"))?.Id}#${currentPage+1}#10`);
            console.log(response);
            
            setBakyat(response);
        }
        fetchBakyat();
    }, []);
  return (
    <div>

    </div>
  )
}

export default Bakyat