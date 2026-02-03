import pandas as pd
import io
import pymupdf # type: ignore

class DocumentParser:
    @staticmethod
    async def parse_file(file_content: bytes, filename: str) -> pd.DataFrame:
        """
        Parses uploaded file (PDF/XLSX/CSV) and returns a standardized pandas DataFrame.
        Expected columns in output: ['date', 'description', 'amount']
        """
        try:
            if filename.endswith('.csv'):
                df = pd.read_csv(io.BytesIO(file_content))
            elif filename.endswith('.xlsx'):
                df = pd.read_excel(io.BytesIO(file_content))
            elif filename.endswith('.pdf'):
                return DocumentParser._parse_pdf(file_content)
            else:
                raise ValueError("Unsupported file format")
            
            # Basic normalization (lowercasing columns)
            df.columns = [c.lower().strip() for c in df.columns]

            # Common Mapping Logic
            mapping = {
                'narration': 'description',
                'payee': 'description',
                'particulars': 'description',
                'transaction date': 'date',
                'value date': 'date',
                'tran date': 'date',
                'withdrawal': 'debit',
                'deposit': 'credit',
                'qty': 'qty',
                'quantity': 'qty',
                'unit cost': 'unitcost',
                'unit_cost': 'unitcost',
                'invoice no': 'invoiceno',
                'invoice_no': 'invoiceno',
                'invoice #': 'invoiceno',
                'item': 'item/category',
                'category': 'item/category',
                'type': 'type'
            }
            
            # Rename columns if they exist in mapping but the target isn't already there
            cols_to_rename = {}
            for old_col, new_col in mapping.items():
                if old_col in df.columns and new_col not in df.columns:
                    cols_to_rename[old_col] = new_col
            
            if cols_to_rename:
                df = df.rename(columns=cols_to_rename)

            # Ensure minimal structure for generic analysis
            if 'description' not in df.columns:
                # Fallback: find any string column that looks like a description
                str_cols = df.select_dtypes(include=['object']).columns
                if len(str_cols) > 0:
                    df = df.rename(columns={str_cols[0]: 'description'})

            return df
            
        except Exception as e:
            raise ValueError(f"Error parsing file: {str(e)}")

    @staticmethod
    def _parse_pdf(file_content: bytes) -> pd.DataFrame:
        """
        Extracts text from PDF and attempts to find table-like structures.
        This is a simplified implementation.
        """
        doc = pymupdf.open(stream=file_content, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
            
        # Very naive parsing - assuming CSV-like structure in text
        # In production, use tabula-py or similar
        lines = text.split('\n')
        data = [line.split() for line in lines if len(line.split()) > 2] # Filter short lines
        
        return pd.DataFrame(data, columns=['raw_text_1', 'raw_text_2', 'raw_text_3']) # Placeholder columns
