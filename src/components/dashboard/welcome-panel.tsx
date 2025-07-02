import SuaveLogo from '../suave-logo';

const WelcomePanel = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-32 h-32 border-4 border-primary transform rotate-45 flex items-center justify-center mx-auto mb-8 opacity-50">
            <div className="transform -rotate-45 text-center">
                <SuaveLogo size="large" />
            </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-400">Select a client to begin</h2>
        <p className="text-gray-500 mt-2">Or create a new client using the '+' button.</p>
    </div>
  );
};

export default WelcomePanel;
