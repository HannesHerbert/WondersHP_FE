import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logger } from 'sass';



const KeyListener = () => {
    const [input, setInput] = useState('');
    const navigate = useNavigate();
    const secretCode = import.meta.env.VITE_ADMIN_LOGIN_PW
    const timeoutDuration = 1000;

    useEffect(() => {
        const handleKeydown = (event) => {
          setInput((prevInput) => {
            const newInput = prevInput + event.key;
            if (newInput === secretCode) {
              navigate('/login');
            }
            return newInput;
          });
        };
    
        window.addEventListener('keydown', handleKeydown);
    
        return () => {
          window.removeEventListener('keydown', handleKeydown);
        };
      }, []);
    
      useEffect(() => {
        if (input.length >= secretCode.length && input !== secretCode){
            setInput('');
          }
        else if (input) {
          const timer = setTimeout(() => {
            setInput('');
          }, timeoutDuration);
    
          return () => clearTimeout(timer);
        }          

      }, [input]);
  
    return null;
  };
  
export default KeyListener;
