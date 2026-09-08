import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Lock, ArrowRight } from 'lucide-react';
import { useBoardService } from '../context/BoardServiceContext.jsx';

const RegistrationPage = () => {
  const [editToken, setEditToken] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const boardService = useBoardService();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      const boardId = await boardService.register(editToken);
      navigate(`/edit/${boardId}`);
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-zinc-200">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <UserPlus className="h-8 w-8 text-zinc-100" />
          </div>
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Create your board</h2>
          <p className="mt-2 text-sm text-zinc-500">Set up your personal 2x2 task planner</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1.5 ml-1">
                Edit Token
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  type="password"
                  required
                  disabled={isRegistering}
                  className="block w-full pl-10 pr-3 py-3 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent transition-all bg-zinc-50/50 disabled:opacity-50"
                  placeholder="Enter your secret token"
                  value={editToken}
                  onChange={(e) => setEditToken(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isRegistering}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-950 transition-all shadow-md disabled:opacity-50"
            >
              {isRegistering ? 'Registering...' : 'Get Started'}
              {!isRegistering && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;

