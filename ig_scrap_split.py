from fastapi import FastAPI, UploadFile, File
import pandas as pd
import os

app = FastAPI()

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())
        
        df = pd.read_excel(file_path)
        
        # Eliminar la primera columna
        df = df.iloc[:, 1:]
        
        # Ordenar la base de datos por la columna 'Followers count' de mayor a menor
        df = df.sort_values(by='Followers count', ascending=False)
        
        # Filtrar en base a la columna 'Followers count'
        df_mano = df[df['Followers count'] >= 6000]  # Usuarios con >= 6000 seguidores
        df_ia = df[df['Followers count'] < 6000]  # Usuarios con < 6000 seguidores
        
        # Guardar en CSV
        mano_path = os.path.join(OUTPUT_FOLDER, "BBDD_Mano.csv")
        ia_path = os.path.join(OUTPUT_FOLDER, "BBDD_IA.csv")
        df_mano.to_csv(mano_path, index=False)
        df_ia.to_csv(ia_path, index=False)
        
        return {"message": "Archivo procesado", "mano": mano_path, "ia": ia_path}
    
    except Exception as e:
        return {"error": str(e)}
