import express, { json } from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
const products = JSON.parse(await readFile(new URL('../public/api/products.json', import.meta.url), 'utf-8'));


const PORT = process.env.PORT || 3002;

dotenv.config();

const app = express();

app.use(cors());
app.use(json());

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

const productsFn = {
  listByCategory: async ({ category }) => {
    return products
      .filter(item => item.category === category)
      .map(item => ({ 
        name: item.name, 
        id: item.id,
        price: item.price,
        color: item.color
      }));
  },

  searchByName: async ({ name }) => {
    return products
      .filter(item => item.name.toLowerCase().includes(name.toLowerCase()))
      .map(item => ({ 
        name: item.name, 
        id: item.id,
        category: item.category
      }));
  },

  getProductDetails: async ({ id }) => {
    const product = products.find(item => item.id === id);
    return product ? {
      name: product.name,
      price: product.price,
      color: product.color,
      capacity: product.capacity,
      year: product.year,
      category: product.category,
      specs: {
        screen: product.screen,
        ram: product.ram,
        storage: product.capacity
      }
    } : null;
  },

  filterByPriceRange: async ({ min, max }) => {
    return products
      .filter(item => item.price >= min && item.price <= max)
      .map(item => ({
        name: item.name,
        id: item.id,
        price: item.price,
        category: item.category
      }));
  },

  filterBySpecs: async ({ specs }) => {
    return products.filter(item => {
      return Object.entries(specs).every(([key, value]) => {
        if (key === 'screenSize') {
          const itemScreenSize = parseFloat(item.screen);
          return itemScreenSize >= value.min && itemScreenSize <= value.max;
        }
        return item[key] === value;
      });
    }).map(item => ({
      name: item.name,
      id: item.id,
      category: item.category,
      price: item.price
    }));
  },
  
  getComparisons: async ({ productIds }) => {
    return products
      .filter(item => productIds.includes(item.id))
      .map(item => ({
        name: item.name,
        id: item.id,
        price: item.price,
        specs: {
          screen: item.screen,
          ram: item.ram,
          storage: item.capacity
        }
      }));
  }
};

const tools = [
  {
    type: 'function',
    function: {
      function: productsFn.listByCategory,
      parse: JSON.parse,
      description: 'List products by category with key details',
      parameters: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['tablets', 'accessories', 'phones']
          }
        },
        required: ['category']
      }
    }
  },
  {
    type: 'function',
    function: {
      function: productsFn.searchByName,
      parse: JSON.parse,
      description: 'Search products by name with partial matching',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string' }
        },
        required: ['name']
      }
    }
  },
  {
    type: 'function',
    function: {
      function: productsFn.getProductDetails,
      parse: JSON.parse,
      description: 'Get detailed specifications for a specific product',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'number' }
        },
        required: ['id']
      }
    }
  },
  {
    type: 'function',
    function: {
      function: productsFn.filterByPriceRange,
      parse: JSON.parse,
      description: 'Filter products within a specific price range',
      parameters: {
        type: 'object',
        properties: {
          min: { type: 'number' },
          max: { type: 'number' }
        },
        required: ['min', 'max']
      }
    }
  },
  {
    type: 'function',
    function: {
      function: productsFn.filterBySpecs,
      parse: JSON.parse,
      description: 'Filter products by technical specifications',
      parameters: {
        type: 'object',
        properties: {
          specs: {
            type: 'object',
            properties: {
              screenSize: {
                type: 'object',
                properties: {
                  min: { type: 'number' },
                  max: { type: 'number' }
                }
              },
              ram: { type: 'string' },
              capacity: { type: 'string' },
              color: { type: 'string' }
            }
          }
        },
        required: ['specs']
      }
    }
  },
  {
    type: 'function',
    function: {
      function: productsFn.getComparisons,
      parse: JSON.parse,
      description: 'Compare multiple products side-by-side',
      parameters: {
        type: 'object',
        properties: {
          productIds: {
            type: 'array',
            items: { type: 'number' }
          }
        },
        required: ['productIds']
      }
    }
  }
];

app.post('/', async (req, res) => {
  try {
    const runner = openai.beta.chat.completions.runTools({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: req.body.message }],
      tools,
    });

    const result = await runner.finalContent();

    res.send(JSON.stringify(result));
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});