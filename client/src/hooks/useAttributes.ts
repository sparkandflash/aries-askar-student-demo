import { Attributes } from '@/studentData';
import { useState } from 'react';


const useAttributes = () => {
    const [attributes, setAttributes] = useState<Attributes>({
      name: '',
      id: '',
      course: '',
      year: '',
      mark: '',
    });
  
    const setAttributesData = (data: any) => {
      if (
        Array.isArray(data) &&
        data.length === 5 &&
        data.every((attr) => typeof attr === 'object' && 'name' in attr && 'value' in attr)
      ) {
        setAttributes({
          name: data.find((attr) => attr.name === 'name')?.value || '',
          id: data.find((attr) => attr.name === 'id')?.value || '',
          course: data.find((attr) => attr.name === 'course')?.value || '',
          year: data.find((attr) => attr.name === 'year')?.value || '',
          mark: data.find((attr) => attr.name === 'mark')?.value || '',
        });
      } else {
       
        console.error('Invalid attributes data format');
      }
    };
  
    return { attributes, setAttributesData };
  };
  
  export default useAttributes;