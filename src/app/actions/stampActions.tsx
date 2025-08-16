'use server';
import { revalidatePath } from 'next/cache';

export interface StampData {
  ownerAddress: string;
  restaurantName: string;
  stampId: string;
  txHash: string;
  ipfs: string;
  storeName: string;
  voucherType: string;
  voucherAmount: number;
  validUntil: string;
  status?: string;
  createdAt?: string;
  variant?:
    | 'taxi'
    | 'subway'
    | 'manhattan'
    | 'coffee'
    | 'restaurant'
    | 'bar'
    | 'hotel'
    | 'luxury';
}

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
  count?: number;
}

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000';

export const mintStamp = async (stampData: StampData) => {
  try {
    const response = await fetch(`${baseUrl}/api/mint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stampData),
    });

    const result = await response.json();

    if (result.success) {
      revalidatePath('/dashboard', 'layout');
    }

    return {
      success: result.success,
      data: result.data,
      message: result.message,
      error: result.error,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error occurred',
      status: 500,
    };
  }
};

// Get stamps by owner address
export const getStampsByOwnerAddress = async (
  ownerAddress: string,
  filters?: { status?: string; storeName?: string; voucherType?: string }
) => {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.storeName) params.append('storeName', filters.storeName);
    if (filters?.voucherType) params.append('voucherType', filters.voucherType);

    const queryString = params.toString();
    const url = `${baseUrl}/api/owner/${ownerAddress}${
      queryString ? `?${queryString}` : ''
    }`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();

    return {
      success: result.success,
      data: result.data,
      count: result.count,
      error: result.error,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error occurred',
      status: 500,
    };
  }
};

// Change stamp status
export const changeStampStatus = async (
  stampIds: string | string[],
  newStatus: string
) => {
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000';

  try {
    const response = await fetch(`${baseUrl}/api/updateStatus`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stampIds: Array.isArray(stampIds) ? stampIds : [stampIds],
        status: newStatus,
      }),
    });

    const result = await response.json();

    if (result.success) {
      revalidatePath('/', 'layout');
    }

    return {
      success: result.success,
      data: result.data,
      updatedCount: result.updatedCount,
      failedIds: result.failedIds,
      error: result.error,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error occurred',
      status: 500,
    };
  }
};

// Get stamps filtered by store name
export const getStampsFilteredByStoreName = async (
  storeName: string,
  filters?: { status?: string; voucherType?: string }
) => {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.voucherType) params.append('voucherType', filters.voucherType);

    const queryString = params.toString();
    const url = `${baseUrl}/api/store/${storeName}${
      queryString ? `?${queryString}` : ''
    }`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();

    return {
      success: result.success,
      data: result.data,
      count: result.count,
      storeName: result.storeName,
      error: result.error,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error occurred',
      status: 500,
    };
  }
};

// Get single stamp by ID
export const getStampById = async (stampId: string) => {
  try {
    const response = await fetch(`${baseUrl}/api/${stampId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();

    return {
      success: result.success,
      data: result.data,
      error: result.error,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error occurred',
      status: 500,
    };
  }
};
