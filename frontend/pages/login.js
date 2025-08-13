import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (localStorage.getItem('isLoggedIn')) {
            router.push('/chat');
        }
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();

        let users = JSON.parse(localStorage.getItem('users')) || [];

        const matchedUser = users.find(
            (user) => user.email === email && user.password === password
        );

        if (matchedUser) {
            localStorage.setItem('activeUser', JSON.stringify(matchedUser));
            localStorage.setItem('isLoggedIn', 'true');
            router.push('/chat');
        } else {
            alert('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/background.jpg')" }}>
            <div className="bg-white rounded-3xl shadow-xl text-center flex flex-col justify-center items-center" style={{ width: '350px', height: '400px' }}>
                <h1 className="text-[32px] font-light mb-10 text-[#213664] font-jersey">
                    LOGIN
                </h1>

                <form className="space-y-6 w-3/4 text-left" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-[#213664] text-[14px] font-light font-inter mb-2">
                            Username / Email:
                        </label>
                        <input
                            type="email"
                            placeholder="Enter username or email"
                            className="w-full p-2 border rounded"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-[#213664] text-[14px] font-light font-inter mb-2">
                            Password:
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            className="w-full p-2 border rounded"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="bg-[#213664] text-white px-6 py-3 rounded-full hover:opacity-80 transition text-center font-inter w-full">
                        Log-in
                    </button>
                </form>
            </div>
        </div>
    );
}
