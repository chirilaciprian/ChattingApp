import { HiChatBubbleBottomCenter, HiUserGroup, HiGlobeAlt, HiSparkles } from "react-icons/hi2";

const RegisterHero = () => {
    return (
        <>
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 relative overflow-hidden">
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/40 via-transparent to-purple-200/40"></div>
                
                {/* Dot pattern overlay */}
                <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: 'radial-gradient(circle, rgb(147 51 234) 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}></div>
                
                {/* Main Content - Centered */}
                <div className="relative z-10 flex flex-col justify-center items-center text-gray-800 p-12 w-full">
                    <div className="text-center max-w-lg">
                        {/* Logo */}
                        <div className="flex justify-center mb-8">
                            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-xl">
                                <HiChatBubbleBottomCenter className="w-12 h-12 text-white" />
                            </div>
                        </div>
                        
                        {/* Heading */}
                        <h1 className="text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Join ChatApp
                        </h1>
                        
                        {/* Subheading */}
                        <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                            Start connecting with people from around the world. Your next great conversation is just a signup away.
                        </p>
                        
                        {/* Features */}
                        <div className="grid grid-cols-3 gap-6 mt-8">
                            <div className="flex flex-col items-center">
                                <div className="w-14 h-14 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-3 shadow-md">
                                    <HiUserGroup className="w-7 h-7 text-purple-600" />
                                </div>
                                <p className="text-sm font-medium text-gray-700">Connect</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-14 h-14 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-3 shadow-md">
                                    <HiGlobeAlt className="w-7 h-7 text-blue-600" />
                                </div>
                                <p className="text-sm font-medium text-gray-700">Explore</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-14 h-14 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-3 shadow-md">
                                    <HiSparkles className="w-7 h-7 text-pink-600" />
                                </div>
                                <p className="text-sm font-medium text-gray-700">Engage</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Background Decorations */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-100/30 rounded-full blur-3xl"></div>
            </div>
        </>
    );
};

export default RegisterHero;