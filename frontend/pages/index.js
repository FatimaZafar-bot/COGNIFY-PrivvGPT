import Link from 'next/link';

export default function Home() {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div
        className="bg-white rounded-3xl shadow-xl text-center flex flex-col justify-center items-center"
        style={{ width: '350px', height: '400px' }}
      >
        <h1 className="text-[34px] font-light mb-16 text-[#213664] font-jersey">
          WELCOME TO   <br />    {'<'}COGNIFY{'>'}
        </h1>
        <div className="flex flex-col space-y-6 w-1/2">
          <Link href="/login" className="bg-[#213664] text-white px-6 py-3 rounded-3xl hover:opacity-80 transition text-center font-inter w-full">
            Log-in
          </Link>
          <Link href="/signup" className="bg-[#213664] text-white px-6 py-3 rounded-3xl hover:opacity-80 transition text-center font-inter w-full">
            Sign-up
          </Link>
        </div>
      </div>
    </div>
  );
}
