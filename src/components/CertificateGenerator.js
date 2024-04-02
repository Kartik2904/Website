import React, { useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import certificateImage from '../images/certificate.png';

function CertificateGenerator(props) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
    
        const img = new Image();
        img.src = certificateImage;
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
    
            // Add dynamic name text overlay
            ctx.font = '100px MonteCarlo-Regular';
            ctx.fillStyle = 'black';
            ctx.fillText(`${props.name}`, 750, 600);
            // You can adjust the position and styling of the text as needed
        };
    }, [props.name]); // Re-render canvas when name prop changes
     // Re-render canvas when name prop changes

    const generateCertificatePDF = () => {
        const canvas = canvasRef.current;

        // Create a new jsPDF instance
        const doc = new jsPDF('landscape');

        // Add canvas content to the PDF
        doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 297, 210); // Adjust width and height as needed

        // Save the PDF
        doc.save('certificate.pdf');
    };

    return (
        <div>
          
            <button onClick={generateCertificatePDF}>Generate Certificate PDF</button>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
}

export default CertificateGenerator;
