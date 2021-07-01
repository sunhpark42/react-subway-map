import { Dispatch, SetStateAction, useState } from 'react';
import API, { APIResponseDataStation, StationData } from '../apis/station';
import ERROR_TYPE from '../constants/errorType';
import { ERROR_MESSAGE } from '../constants/messages';

interface Error {
  type: string;
  message: string;
}

const defaultError = {
  type: ERROR_TYPE.DEFAULT,
  message: ERROR_MESSAGE.DEFAULT,
};

const useStations = (
  initialStations: APIResponseDataStation[]
): [
  APIResponseDataStation[],
  Dispatch<SetStateAction<APIResponseDataStation[]>>,
  () => Promise<boolean>,
  (data: StationData) => Promise<boolean>,
  (stationId: number) => Promise<boolean>,
  Error
] => {
  const [stations, setStations] = useState<APIResponseDataStation[]>(initialStations);
  const [error, setError] = useState(defaultError);

  const fetchStations = async (): Promise<boolean> => {
    const response = await API.get();

    if (response.ok) {
      setStations(response.data || []);
      return true;
    }

    setError(response.error || defaultError);
    return false;
  };

  const addStation = async (data: StationData): Promise<boolean> => {
    const response = await API.post(data);

    if (response.ok) {
      return true;
    }

    setError(response.error || defaultError);
    return false;
  };

  const deleteStation = async (stationId: number): Promise<boolean> => {
    const response = await API.delete(stationId);

    if (response.ok) {
      return true;
    }

    setError(response.error || defaultError);
    return false;
  };

  return [stations, setStations, fetchStations, addStation, deleteStation, error];
};

export default useStations;
