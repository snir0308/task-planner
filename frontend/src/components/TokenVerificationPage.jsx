import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useBoardService } from '../context/BoardServiceContext.jsx';
import Board from './Board.jsx';

const TokenVerificationPage = () => {
  const { boardId } = useParams();
  const [editToken, setEditToken] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'verifying', 'success', 'error'
  const [showBoard, setShowBoard] = useState(false);
  const boardService = useBoardService();

  const handleVerify = async (e) => {
    e.preventDefault();
    setStatus('verifying');
    try {
      const isValid = await boardService.validateEditToken(boardId, editToken);
      if (isValid) {
        setStatus('success');
        setTimeout(() => {
          setShowBoard(true);
        }, 1000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
    }
  };

   if (showBoard) {
     return <Board readOnly={false} boardId={boardId} />;
   }


  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-zinc-200">
        <div className="text-center">
          <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4 shadow-lg ${
            status === 'success' ? 'bg-green-100 text-green-600' : 
            status === 'error' ? 'bg-rose-100 text-rose-600' : 'bg-zinc-900 text-zinc-100'
          }`}>
            {status === 'success' ? <CheckCircle className="h-8 w-8" /> : 
             status === 'error' ? <AlertCircle className="h-8 w-8" /> : 
             <Lock className="h-8 w-8" />}
          </div>
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">
            {status === 'success' ? 'Access Granted' : 
             status === 'error' ? 'Invalid Token' : 'Verify Access'}
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            {status === 'success' ? 'Redirecting to your board...' : 
             status === 'error' ? 'The edit token you entered is incorrect.' : 
             'Please enter your edit token to access the board.'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleVerify}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1.5 ml-1">
                Edit Token
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${status === 'error' ? 'text-rose-400' : 'text-zinc-400'}`} />
                </div>
                <input
                  type="password"
                  required
                  disabled={status !== 'idle' && status !== 'error'}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent transition-all bg-zinc-50/50 ${
                    status === 'error' ? 'border-rose-300 focus:ring-rose-950' : 'border-zinc-200'
                  }`}
                  placeholder="Enter your secret token"
                  value={editToken}
                  onChange={(e) => setEditToken(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'verifying' || status === 'success'}
            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white transition-all shadow-md ${
              status === 'verifying' || status === 'success' ? 'bg-zinc-400' : 'bg-zinc-900 hover:bg-zinc-800'
            }`}
          >
            {status === 'verifying' ? 'Verifying...' : 'Verify Token'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TokenVerificationPage;

