// import React, { useState, useEffect } from 'react';
// import { RecaptchaVerifier } from 'firebase/auth';
// import { auth } from '../../services/firebase'; // Ensure this exports initialized auth

// interface RecaptchaProps {
//     onVerifierReady: (verifier: RecaptchaVerifier) => void;
// }

// const RecaptchaComponent: React.FC<RecaptchaProps> = ({ onVerifierReady }) => {
//     const [recaptchaElement, setRecaptchaElement] = useState<HTMLDivElement | null>(null);
//     const verifierRef = React.useRef<RecaptchaVerifier | null>(null);

//     // Create reCAPTCHA after the DOM element is available
//     useEffect(() => {
//         if (!recaptchaElement || !auth) return; // Ensure auth is defined

//         const verifier = new RecaptchaVerifier(
//             recaptchaElement, // This should be the HTML element
//             {
//                 size: 'invisible',
//                 callback: () => console.log('reCAPTCHA solved'),
//                 'expired-callback': () => console.log('reCAPTCHA expired')
//             },
//             auth // This should be the Firebase Auth instance
//         );

//         verifier.render()
//             .then(() => {
//                 verifierRef.current = verifier;
//                 onVerifierReady(verifier);
//             })
//             .catch((error) => console.error('reCAPTCHA render error:', error));

//         return () => {
//             verifier.clear();
//         };
//     }, [recaptchaElement, onVerifierReady]);

//     return (
//         <div>
//             {/* Using callback ref to get the DOM element */}
//             <div ref={setRecaptchaElement} style={{ display: 'none' }} />
//         </div>
//     );
// };

// export default RecaptchaComponent;
