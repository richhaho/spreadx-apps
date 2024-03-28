// this function is here since we might need to depend on state later
export const print = ((content, title) => {
    var printWindow = window.open('', '', '');
    printWindow.document.write(`<html>
    <head>

    <style>

    table {
            width: 100%;
            border-collapse: collapse;
            font-family: "Arimo", sans-serif;
            font-optical-sizing: auto;
       }
    
       table, td,th{
            font-size: 14px!important;
            text-align: start;
            
            border: 0.5px solid black;
        }

        p{
        padding: 0 !important;
        margin: 0 !important;
        font-size: 14px!important;
        }

        td{
            text-align: start !important;
        }

        .right{
            text-align: end!important;
        }

        h4{
            font-weight: 100;
        }

        .heading{
            text-align: center!important;
        }
    
    </style
    `
    );
    printWindow.document.write(`</head><body >`);
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.onload = function () {
        printWindow.onafterprint = function () {
            printWindow.close();
        };
        printWindow.print();
    };
})

// < link href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel = "stylesheet" >
