import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useReactToPrint } from 'react-to-print';
import emailjs from '@emailjs/browser';
import style from './Certificate.module.css';
import certificate from '../images/certificate.png';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import CertificateGenerator from './CertificateGenerator';

const GenerateCertificate = () => {

    const ref = useRef(null);
    const componentPdf = useRef();
    const form = useRef();

    const [number, setNumber] = useState('');
    const [records, setRecords] = useState([]);
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [recordByCity, setRecordByCity] = useState([]);
    const [flag, setFlag] = useState(false);

    const id = (event) => {
        setNumber(event.currentTarget.value);
    }

    const getRecord = async (event) => {
        event.preventDefault();

        if (!number.trim()) {
            // Handle case when number is empty
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/student/result?mobile_number=${number}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setRecords(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const getCity = (event) => {
        setCity(event.currentTarget.value);
    }

    const getRecordByCity = async () => {
        try {
            const response = await fetch(`http://localhost:4000/studentHighestMarksIn?city=${city}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setRecordByCity(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const generatePDF = useReactToPrint({
        content: () => componentPdf.current,
        documentTitle: `Result of ${records.map((record) => (record.first_name))}_${records.map((record) => (record.last_name))}`,
        onAfterPrint: () => alert('data saved in pdf')
    });

    const onDownloadClick = useCallback(() => {
        if (ref.current === null) {
            return;
        }

        toPng(ref.current, { cacheBust: true })
            .then((dataUrl) => {
                const pdf = new jsPDF();
                pdf.addImage(dataUrl, 'PNG', 0, 0, 210, 297);
                pdf.save('certificate.pdf');
            })
            .catch((err) => {
                console.log(err);
            });
    }, [ref]);

    useEffect(() => {
        if (records.length > 0) {
            const fullName = records.map((record) => `${record.first_name} ${record.last_name}`).join(', ');
            setName(fullName);
        }
    }, [records]);
    

   

    return (
        <div className={`container`} style={{ marginTop: '60px' }}>
            <form onSubmit={getRecord} ref={form}>
                <input type='text' placeholder='Number' name='number' onChange={id} className='form-control' />
                <input type='submit' value='Search' className='btn btn-primary' />

                <input type='text' placeholder='City' name='city' onChange={getCity} className='form-control' />
                <input type='button' value='Record' onClick={getRecordByCity} className='btn btn-primary' />
            </form>

            <div>
                {records && records.length > 0 && (
                    <div>
                        <div ref={componentPdf} style={{ width: '100%' }}>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Age</th>
                                        <th>Percentage</th>
                                        <th>Gender</th>
                                        <th>City</th>
                                        <th>Mobile Number</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((record, index) => (
                                        <tr key={index}>
                                           <td>{record.first_name}</td>
                                            <td>{record.last_name}</td>
                                            <td>{record.age}</td>
                                            <td>{record.percentage}</td>
                                            <td>{record.gender}</td>
                                            <td>{record.city}</td>
                                            <td>{record.mobile_number}</td>
                                            <td>{record.email}</td>
                                            <td></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <input type='button' value='Get PDF' className='btn btn-danger' onClick={generatePDF} />
                    </div>
                )}
            </div>

            <div>
                {recordByCity && recordByCity.length > 0 && (
                    <div>
                        <div ref={componentPdf} style={{ width: '100%' }}>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Age</th>
                                        <th>Percentage</th>
                                        <th>Gender</th>
                                        <th>City</th>
                                        <th>Mobile Number</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recordByCity.map((recordCity, index) => (
                                        <tr key={index}>
                                            <td>{recordCity.first_name}</td>
                                            <td>{recordCity.last_name}</td>
                                            <td>{recordCity.age}</td>
                                            <td>{recordCity.percentage}</td>
                                            <td>{recordCity.gender}</td>
                                            <td>{recordCity.city}</td>
                                            <td>{recordCity.mobile_number}</td>
                                            <td>{recordCity.email}</td>
                                            <td></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <input type='button' value='Get PDF' className='btn btn-danger' onClick={generatePDF} />
                    </div>
                )}
            </div>
            {
                records.length > 0 && <CertificateGenerator name={name} />
            }

        </div>
    );
};

export default GenerateCertificate;
