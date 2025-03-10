import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const downloadSampleCsv = () => {
    const zip = new JSZip();

    // Define sample content for each sheet
    const sheets: { [key: string]: string } = {
        'KnowledgeBase.csv': 'id,category,status,note\n1,Sample Category,Active,Sample Note',
        'InterviewQuestions.csv': 'id,category,question,answer\n1,Sample Category,Sample Question,Sample Answer'
    };

    // Add each sheet to the ZIP file
    Object.keys(sheets).forEach(sheetName => {
        zip.file(sheetName, sheets[sheetName as keyof typeof sheets]);
    });

    // Generate the ZIP file and trigger the download
    zip.generateAsync({ type: 'blob' }).then(content => {
        saveAs(content, 'sample-sheets.zip');
    });
};