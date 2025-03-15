interface LoginSectionProps {
    title: string;
    children: React.ReactNode;
}

const LoginSection: React.FC<LoginSectionProps> = ({ title, children }) => (
    <div className='bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100 max-w-md mx-auto'>
        <h3 className='text-center font-semibold text-xl mb-4'>{title}</h3>
        {children}
    </div>
);

export default LoginSection;