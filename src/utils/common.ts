import fs from 'fs';

async function readAndSaveSchema(filePath: string): Promise<any | null> {
    try {
        const jsonContent = await fs.promises.readFile(filePath, 'utf8');
        const schemaTemplate = JSON.parse(jsonContent);
        const propertySchema = schemaTemplate;

        return propertySchema;
    } catch (error: any) { 
        console.error('Error reading or parsing the JSON file:', error.message);
        return null;
    }
}

export { readAndSaveSchema };
