# Embedded Data Model

Tigris offers rich documents that enable embedding related data in a single
document. Embedded models allow applications to complete database operations
with fewer queries or updates, thus reducing query activity and increasing
efficiency.

Below is an example of embedded data model. We first define the `ProductItem`
type and then embed it inside the `Order` type.

```typescript
// data containers
export interface ProductItem {
  productId: number;
  quantity: number;
}
export interface Order extends TigrisCollectionType {
  orderId?: number;
  userId: number;
  productItems: ProductItem[];
  orderTotal: number;
}

// schema definitions
const productItemSchema: TigrisSchema<ProductItem> = {
  productId: {
    type: TigrisDataTypes.INT32,
  },
  quantity: {
    type: TigrisDataTypes.INT32,
  },
};
export const orderSchema: TigrisSchema<Order> = {
  orderId: {
    type: TigrisDataTypes.INT32,
    primary_key: {
      order: 1,
      autoGenerate: true,
    },
  },
  userId: {
    type: TigrisDataTypes.INT32,
  },
  orderTotal: {
    type: TigrisDataTypes.NUMBER,
  },
  productItems: {
    type: TigrisDataTypes.ARRAY,
    items: {
      type: productItemSchema,
    },
  },
};
```
