import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Button, TextField } from '@mui/material';
import axiosInstance from '../../api/axios';

interface ShopItem {
  item_id: number;
  title: string;
  price: number;
}

const ShopManagement: React.FC<{ sessionId: number }> = ({ sessionId }) => {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [newItem, setNewItem] = useState({ itemId: '', price: '' });

  const fetchShopItems = async () => {
    const response = await axiosInstance.get(`/session-management/${sessionId}/shop-items`);
    setShopItems(response.data);
  };

  useEffect(() => {
    fetchShopItems();
  }, [sessionId]);

  const addItemToShop = async () => {
    await axiosInstance.post(`/session-management/${sessionId}/shop-items`, {
      item_id: newItem.itemId,
      price: newItem.price,
    });
    setNewItem({ itemId: '', price: '' });
    fetchShopItems();
  };

  return (
    <div>
      <Grid container spacing={2}>
        {shopItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.item_id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="body2">Price: ${item.price.toFixed(2)}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <div style={{ marginTop: 20 }}>
        <TextField
          label="Item ID"
          value={newItem.itemId}
          onChange={(e) => setNewItem({ ...newItem, itemId: e.target.value })}
          style={{ marginRight: 8 }}
        />
        <TextField
          label="Price"
          type="number"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          style={{ marginRight: 8 }}
        />
        <Button variant="contained" color="primary" onClick={addItemToShop}>
          Add Item
        </Button>
      </div>
    </div>
  );
};

export default ShopManagement;
