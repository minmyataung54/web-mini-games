import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  
  return (
    <div className="p-10 flex gap-5">
      <div 
        className='border border-gray-300 p-4 cursor-pointer' 
        onClick={() => navigate('/catch-ingridients')}
      >
        Catch the ingridients
      </div>
      <div 
        className='border border-gray-300 p-4 cursor-pointer' 
        onClick={() => navigate('/catch-bottles')}
      >
        Catch the bottles
      </div>
    </div>
  )
}

export default Home
