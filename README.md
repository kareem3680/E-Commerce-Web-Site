# E-Commerce Website - API Documentation

## Overview

This API is designed for the **E-Commerce Website Platform**.  
It is a complete backend infrastructure for online shopping platforms managing products, users, carts, and orders.

---

# Common Features

All list endpoints support the following features:

| Feature         | Description                   | Example                            |
| --------------- | ----------------------------- | ---------------------------------- |
| Pagination      | Split results into pages      | `?page=2&limit=20`                 |
| Sorting         | Sort results by a field       | `?sort=-createdAt` or `?sort=name` |
| Field Selection | Return only specific fields   | `?fields=name,email,phone`         |
| Filtering       | Filter results by exact match | `?status=active&role=admin`        |
| Range Filtering | Filter by numeric ranges      | `?price[lte]=1000&price[gte]=100`  |
| Date Range      | Filter by date interval       | `?from=2025-01-01&to=2025-12-31`   |
| Search          | Text search in string fields  | `?keyword=iphone`                  |

---

# Authentication Module

| Endpoint                         | Method | Description                               |
| -------------------------------- | ------ | ----------------------------------------- |
| `/api/v1/auth/signUp`            | POST   | Register a new user                      |
| `/api/v1/auth/signUp-google`     | POST   | Register using Google (idToken)          |
| `/api/v1/auth/logIn`             | POST   | Login                                    |
| `/api/v1/auth/verify-2FA`        | POST   | Verify two-factor authentication code    |
| `/api/v1/auth/resend-2FA`        | POST   | Resend two-factor authentication code    |

---

# Forget Password Module (OTP)

| Endpoint                                 | Method | Description                       |
| ---------------------------------------- | ------ | --------------------------------- |
| `/api/v1/forgetPassword/sendResetCode`   | POST   | Send reset code to email          |
| `/api/v1/forgetPassword/verifyResetCode` | POST   | Verify reset code                 |
| `/api/v1/forgetPassword/resetPassword`   | PUT    | Reset password after verification |

---

# Admin Dashboard Module

| Endpoint                         | Method | Description                          |
| -------------------------------- | ------ | ------------------------------------ |
| `/api/v1/admin`                  | POST   | Create a new user (admin only)       |
| `/api/v1/admin`                  | GET    | Get all users (paginated)            |
| `/api/v1/admin/{userId}`         | GET    | Get specific user                    |
| `/api/v1/admin/{userId}`         | PUT    | Update user                          |
| `/api/v1/admin/changePassword`   | PUT    | Change user password (admin)         |
| `/api/v1/admin/{userId}`         | DELETE | Delete user                          |

---

# User Dashboard Module

| Endpoint                               | Method | Description                           |
| -------------------------------------- | ------ | ------------------------------------- |
| `/api/v1/users/getMyData`              | GET    | Get current user data                |
| `/api/v1/users/updateMyData`           | PUT    | Update current user data             |
| `/api/v1/users/updateMyPassword`       | PUT    | Change current user password         |
| `/api/v1/users/deactivateMyUser`       | DELETE | Deactivate current user account      |

---

# Affiliate Dashboard Module

## Affiliate Status

| Status       | Description                          |
| ------------ | ------------------------------------ |
| `pending`    | Affiliate application pending        |
| `approved`   | Affiliate approved                   |
| `rejected`   | Affiliate rejected                   |
| `suspended`  | Affiliate suspended                  |

## Affiliate Endpoints

| Endpoint                                      | Method | Description                           |
| --------------------------------------------- | ------ | ------------------------------------- |
| `/api/v1/affiliates/register`                 | POST   | Register as affiliate (user required) |
| `/api/v1/affiliates/dashboard`                | GET    | Get affiliate dashboard statistics    |
| `/api/v1/affiliates/commissions`              | GET    | Get affiliate commissions             |
| `/api/v1/affiliates/track-click/{referralCode}` | POST | Track referral click                  |
| `/api/v1/affiliates/request-payout`           | POST   | Request commission payout             |
| `/api/v1/affiliates/orders`                   | GET    | Get affiliate orders                  |

---

# Accountant Dashboard Module

## Payout Request Status Flow

pending -> approved -> paid -> rejected

## Accountant Endpoints

| Endpoint                                                | Method | Description                           |
| ------------------------------------------------------- | ------ | ------------------------------------- |
| `/api/v1/accountants/commission-requests`               | GET    | Get all commission payout requests    |
| `/api/v1/accountants/commission-requests/{requestId}/review` | PUT | Approve or reject payout request |
| `/api/v1/accountants/commission-requests/{requestId}/pay` | PUT | Mark request as paid                 |
| `/api/v1/accountants/affiliate-commissions`             | GET    | Get affiliate commission report       |
| `/api/v1/accountants/paid-orders`                       | GET    | Get paid orders report                |

---

# Categories Module

## Category Endpoints

| Endpoint                        | Method | Description                           |
| ------------------------------- | ------ | ------------------------------------- |
| `/api/v1/categories`            | POST   | Create a new category (admin only)    |
| `/api/v1/categories`            | GET    | Get all categories (paginated)        |
| `/api/v1/categories/{id}`        | GET    | Get specific category                |
| `/api/v1/categories/{id}`        | PUT    | Update category (admin only)          |
| `/api/v1/categories/{id}`        | DELETE | Delete category (admin only)          |

---

# Products Module

## Product Endpoints

| Endpoint                        | Method | Description                           |
| ------------------------------- | ------ | ------------------------------------- |
| `/api/v1/products`              | POST   | Create a new product (admin only)     |
| `/api/v1/products`              | GET    | Get all products (paginated, filtered)|
| `/api/v1/products/{id}`         | GET    | Get specific product                  |
| `/api/v1/products/{id}`         | PUT    | Update product (admin only)           |
| `/api/v1/products/{id}`         | DELETE | Delete product (admin only)           |

---

# Coupons Module

## Coupon Endpoints

| Endpoint                        | Method | Description                           |
| ------------------------------- | ------ | ------------------------------------- |
| `/api/v1/coupons`               | POST   | Create a new coupon (admin only)      |
| `/api/v1/coupons`               | GET    | Get all coupons (paginated)           |
| `/api/v1/coupons/{id}`          | GET    | Get specific coupon                   |
| `/api/v1/coupons/{id}`          | PUT    | Update coupon (admin only)            |
| `/api/v1/coupons/{id}`          | DELETE | Delete coupon (admin only)            |

---

# Addresses Module

## Address Endpoints

| Endpoint                        | Method | Description                           |
| ------------------------------- | ------ | ------------------------------------- |
| `/api/v1/addresses`             | POST   | Create a new address                  |
| `/api/v1/addresses`             | GET    | Get all addresses                     |
| `/api/v1/addresses/{id}`        | DELETE | Delete address                        |

---

# Wishlists Module

## Wishlist Endpoints

| Endpoint                        | Method | Description                           |
| ------------------------------- | ------ | ------------------------------------- |
| `/api/v1/wishlists`             | POST   | Add product to wishlist               |
| `/api/v1/wishlists`             | GET    | Get all wishlist items                |
| `/api/v1/wishlists/{productId}` | DELETE | Remove product from wishlist          |

---

# Reviews Module

## Review Endpoints

| Endpoint                        | Method | Description                           |
| ------------------------------- | ------ | ------------------------------------- |
| `/api/v1/reviews`               | POST   | Create a new review                   |
| `/api/v1/reviews`               | GET    | Get all reviews (paginated)           |
| `/api/v1/reviews/{id}`          | GET    | Get specific review                   |
| `/api/v1/reviews/{id}`          | PUT    | Update review (owner only)            |
| `/api/v1/reviews/{id}`          | DELETE | Delete review (owner or admin)        |

---

# Product Reviews Module

| Endpoint                                      | Method | Description                           |
| --------------------------------------------- | ------ | ------------------------------------- |
| `/api/v1/products/{productId}/reviews`        | GET    | Get all reviews for specific product  |
| `/api/v1/products/{productId}/reviews`        | POST   | Create review for specific product    |

---

# Carts Module

## Cart Endpoints

| Endpoint                        | Method | Description                           |
| ------------------------------- | ------ | ------------------------------------- |
| `/api/v1/carts`                 | GET    | Get all products in cart              |
| `/api/v1/carts`                 | POST   | Add product to cart                   |
| `/api/v1/carts/applyCoupon`     | PUT    | Apply coupon to cart                  |
| `/api/v1/carts/{cartItemId}`    | PUT    | Update product quantity in cart       |
| `/api/v1/carts/{cartItemId}`    | DELETE | Delete specific product from cart     |
| `/api/v1/carts`                 | DELETE | Clear entire cart                     |

---

# Orders Module

## Order Status Flow

pending -> processing -> shipped -> delivered -> cancelled

## Order Endpoints

| Endpoint                                      | Method | Description                           |
| --------------------------------------------- | ------ | ------------------------------------- |
| `/api/v1/orders/{cartId}`                     | POST   | Create cash order from cart           |
| `/api/v1/orders/checkout-session/{cartId}`    | GET    | Create Stripe checkout session        |
| `/api/v1/orders`                              | GET    | Get all orders (paginated)            |
| `/api/v1/orders/{orderId}`                    | PUT    | Update order status (admin only)      |
| `/api/v1/orders/{orderId}`                    | DELETE | Delete order (admin only)             |

---

# Settings Module

## Settings Endpoints

| Endpoint                        | Method | Description                           |
| ------------------------------- | ------ | ------------------------------------- |
| `/api/v1/settings`              | POST   | Add a new setting (admin only)        |
| `/api/v1/settings`              | GET    | Get all settings                      |
| `/api/v1/settings/{id}`         | PUT    | Update setting value (admin only)     |

---

# Authentication

JWT is used for authentication. Most endpoints require a Bearer token in the Authorization header:
Authorization: Bearer {{JWT}}

text

## Two-Factor Authentication (2FA)

- After login with valid credentials, a 2FA code is sent to the user's email.
- The user must verify the code using `/api/v1/auth/verify-2FA` to receive the JWT token.
- The code can be resent using `/api/v1/auth/resend-2FA`.

---

# Notes

- All list endpoints support pagination, sorting, filtering, and search.
- File uploads (images) use `multipart/form-data`.
- The `{{mainHost}}` variable should be replaced with your API base URL.
- Admin endpoints require admin role privileges.
- Affiliate and accountant roles have specific access to their respective modules.
