import { useLocation } from 'react-router-dom';

/**
 * Returns an object of query parameters parsed from the current URL.
 * @returns {Object} object of query parameters
 */
const useQueryParams = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location?.search);

    return Object.fromEntries(queryParams.entries());
};

export default useQueryParams;