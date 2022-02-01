import { useState } from 'react';

const useModal = (initialMode = false) => {
  const [isModalVisible, setIsModalVisible] = useState(initialMode);

  const toggleModal = () => setIsModalVisible(!isModalVisible);

  return [isModalVisible, setIsModalVisible, toggleModal];
};

export default useModal;
