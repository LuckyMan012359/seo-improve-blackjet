import React, { useEffect, useState } from 'react';
import { getviewLegal } from 'services/api';

/**
 * This component renders a legal card based on the id passed as a prop.
 * It fetches the legal content from the server using the getviewLegal function
 * and renders it in a div with the class 'static-pages-content'.
 * If the id is not defined, it renders a 'Loading...' message.
 *
 * @param {String} id - The id of the legal content to be rendered.
 * @returns A React component that renders the legal content.
 */
export const LegalCardsById = ({id}) => {
  const [selectedLegal, setSelectedLegal] = useState(null);

  const viewLegalById = async () => {
    setSelectedLegal(null);
    try {
     
      const res = await getviewLegal(id);
      console.log(res, 'this_is_response');
      setSelectedLegal(res?.data?.data);

      // setSelectedId(res?.data?.data[0]._id || {});
    } catch (error) {
      console.log(error);
      setSelectedLegal(null);
    }
  };

  // console.log(id)

  useEffect(() => {
    if (id !== '' && id !== undefined) {
      viewLegalById();
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!selectedLegal) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col w-full font-['Hauora'] items-start">
        <div className='legal-title'>{selectedLegal?.legal_title}</div>

        <div
          className='static-pages-content'
          id='render-text'
          dangerouslySetInnerHTML={{ __html: selectedLegal.legalContent }}
        ></div>
      </div>
    </>
  );
};

// export default Membership;
