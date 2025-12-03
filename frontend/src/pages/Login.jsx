export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">

      <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-md">

        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Login
        </h2>

        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border px-4 py-2 rounded-lg focus:outline-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            className="border px-4 py-2 rounded-lg focus:outline-blue-500"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

      </div>
    </div>
  );
}
