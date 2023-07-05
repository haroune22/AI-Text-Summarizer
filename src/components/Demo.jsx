/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../Services/Article"; 


const Demo = () => {

  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });

  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");
  const [number, setNumber] = useState(2);

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(()=>{
    const articlesStorage = JSON.parse(localStorage.getItem("articles"));
    if(articlesStorage){
      setArticle(articlesStorage);
    }
  },[])

  const handleSubmit = async(e) => {
    e.preventDefault();
    const { data } = await getSummary({ articleUrl: article.url,articleLength:number });
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary};
      const updatedAllArticles = [newArticle,...allArticles]
      setArticle(newArticle);
      setAllArticles(updatedAllArticles)
      localStorage.setItem("articles",JSON.stringify(updatedAllArticles));
    }
  }
  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };
  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };


  return (
    <section className="mt-16 w-full max-w-xl ">
      <div className="flex flex-col w-full gap-2">
      <form className="relative flex-col w-full gap-2 " onSubmit={handleSubmit}>
      <img src={linkIcon} alt="link_icon" className="absolute left-0 my-2 ml-3 w-5" />
      <input type="url" placeholder="Enter Your Url... " value={article.url} onChange={(e)=>setArticle({...article,url:e.target.value})} required className="url_input peer mb-4" onKeyDown={handleKeyDown}/>
      
      
      <button type="submit" className="submit_btn  peer-focus:border-gray-700 peer-focus:text-gray-700">
      <p>↵</p>
      </button>
      </form>
      <div className="flex ">
      <label placeholder="2" htmlFor="quantity">Length. This parameter might be ignored for a very long articles.:</label>
   <input  type="number" className="ml-2 h-6 w-8" value={number} id="quantity" name="quantity" min="1" max="6" onChange={(e)=>setNumber(e.target.value)}></input>
      </div>
      {/* {Browse Url History} */}
      <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
        {allArticles.map((item,index)=>(
          <div key={`link${index}`}
          onClick={()=>setArticle(item)}
          className="link_card">
            <div className="copy_btn" onClick={() => handleCopy(item.url)}>
            <img  src={copied === item.url ? tick : copy}
                  alt={copied === item.url ? "tick_icon" : "copy_icon"} className="w-[40px] h-[40px] object-contain " />
            </div>
            <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
              {item.url}
            </p>
          </div>
        ))}
      </div>
      </div>
      {/* {display result} */}
      <div className="my-10 max-w-full flex justify-center items-center">
          {isFetching ? (
             <img src={loader} alt='loader' className='w-20 h-20 object-contain' />
          ) : error ? (
            <p className='font-inter font-bold text-black text-center'>
              Well, that wasn't supposed to happen...
              <br />
              <span className='font-satoshi font-normal text-gray-700'>
                {error?.data?.error}
              </span>
            </p>
          ) : (
            article.summary && (
              <div className='flex flex-col gap-3'>
                <h2 className='font-satoshi font-bold text-gray-600 text-xl'>
                  Article <span className='blue_gradient'>Summary</span>
                </h2>
                <div className='summary_box'>
                  <p className='font-inter font-medium text-sm text-gray-700'>
                    {article.summary}
                  </p>
                </div>
              </div>
            )
          )

        }
      </div>
    </section>
  )
}

export default Demo