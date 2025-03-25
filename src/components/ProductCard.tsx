import InteractiveCard from './InteractiveCard';

export default function ProductCard({ providerName, onCompare, detail }: { 
    providerName: any; 
    onCompare?: (provider: any) => void; 
    detail: any; 
}) {
    return (
        <InteractiveCard contentName={String(providerName)} detail={String(detail)}>
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 p-6 rounded-2xl shadow-xl 
                            relative overflow-hidden font-serif flex flex-col items-center 
                            min-h-[180px] max-w-sm mx-auto">
                
                {/* ลวดลายพื้นหลัง */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2),_transparent)] opacity-50"></div>
                
                {/* ชื่อผู้ให้บริการ */}
                <h2 className="text-white text-xl font-bold mb-2 text-center drop-shadow-md">
                    {String(providerName)}
                </h2>
                
                {/* รายละเอียด */}
                <p className="text-blue-200 text-sm text-center drop-shadow-sm break-words">
                    {String(detail)}
                </p>

                {/* ปุ่ม Compare */}
                {onCompare && (
                    <div className="mt-auto pt-4">
                        <button 
                            className="bg-white text-blue-700 px-4 py-2 rounded-lg font-medium text-sm shadow-lg 
                                       transition duration-300 hover:bg-blue-100 hover:shadow-blue-400"
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                e.preventDefault(); 
                                onCompare(providerName); 
                            }}
                        >
                            Compare
                        </button>
                    </div>
                )}
            </div>
        </InteractiveCard>
    );
}
