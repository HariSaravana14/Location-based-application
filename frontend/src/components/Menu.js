import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Menu = () => {
  const { hotelId } = useParams();
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetchMenu();
  }); 

  const fetchMenu = async () => {
    try {
      const response = await axios.get(`http://localhost:9900/hotels/${hotelId}/menu`);
      setMenu(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h3>Menu</h3>
      <ul>
        {menu.map((item) => (
          <li key={item.id}>
            {item.name} {item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
