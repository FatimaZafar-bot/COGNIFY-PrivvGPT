import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Signup() {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (localStorage.getItem('isLoggedIn')) {
            router.push('/chat');
        }2
    }, []);

    const handleSignup = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || [];

        const existingUser = users.find((user) => user.email === email);
        if (existingUser) {
            alert('User already exists with this email!');
            return;
        }

        const newUser = { firstName, lastName, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        alert('Signup successful! Please log in.');
        router.push('/login');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/background.jpg')" }}>
            <div className="bg-white p-10 rounded-2xl shadow-xl flex flex-col items-center" style={{ width: '450px', height: '550px' }}>
                <h1 className="text-[32px] font-light mb-10 text-[#213664] font-jersey text-center">
                    SIGN-UP
                </h1>

                <form className="space-y-4 w-full max-w-md" onSubmit={handleSignup}>
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label className="block text-[#213664] text-[14px] font-light font-inter mb-2">First Name:</label>
                            <input
                                type="text"
                                placeholder="First name"
                                className="w-full p-2 border rounded"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-[#213664] text-[14px] font-light font-inter mb-2">Last Name:</label>
                            <input
                                type="text"
                                placeholder="Last name"
                                className="w-full p-2 border rounded"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[#213664] text-[14px] font-light font-inter mb-2">Email:</label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            className="w-full p-2 border rounded"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-[#213664] text-[14px] font-light font-inter mb-2">Enter Password:</label>
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-2 border rounded"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-[#213664] text-[14px] font-light font-inter mb-2">Confirm Password:</label>
                        <input
                            type="password"
                            placeholder="Confirm password"
                            className="w-full p-2 border rounded"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex justify-center">
                        <button type="submit" className="bg-[#213664] text-white px-8 py-2 rounded-3xl hover:opacity-80 transition text-center font-inter w-full">
                            SIGN-UP
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
