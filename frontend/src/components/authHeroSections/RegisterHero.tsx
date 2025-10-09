import { HiChatBubbleBottomCenter } from "react-icons/hi2";

const RegisterHero = () => {
    return (
        <>
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary to-accent relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
                    <div className="mb-8">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-6">
                            <HiChatBubbleBottomCenter className="w-12 h-12" />
                        </div>
                    </div>
                    <h1 className="text-5xl font-bold mb-4 text-center">Join ChatApp</h1>
                    <p className="text-xl text-white/90 text-center max-w-md mb-12">
                        Start connecting with people from around the world. Your next great conversation is just a signup away.
                    </p>
                </div>
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            </div>
        </>)
};

export default RegisterHero;