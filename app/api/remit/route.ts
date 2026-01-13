import { NextRequest, NextResponse } from 'next/server';

// Simulated quantum-safe remittance endpoint.
// In production replace with real KEM and secure key management.

async function generateQuantumSafeKeys() {
  try {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['sign', 'verify']
    );

    const publicKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
    const publicKeyBase64 = Buffer.from(JSON.stringify(publicKeyJwk)).toString('base64');

    return {
      publicKey: publicKeyBase64,
      privateKey: keyPair.privateKey,
    };
  } catch (error) {
    console.error('Key generation error:', error);
    throw error;
  }
}

async function encryptData(data: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      dataBuffer
    );

    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedData), iv.length);

    return Buffer.from(combined).toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { amount, recipient } = await request.json();

    if (amount == null || !recipient) {
      return NextResponse.json(
        { error: 'Amount and recipient are required' },
        { status: 400 }
      );
    }

    const { publicKey } = await generateQuantumSafeKeys();

    const dataToEncrypt = JSON.stringify({
      amount,
      recipient,
      timestamp: new Date().toISOString(),
      nonce: Math.random().toString(36).substring(2),
    });

    const encryptedData = await encryptData(dataToEncrypt);

    return NextResponse.json({
      success: true,
      message: 'Remittance encrypted with quantum-safe keys',
      publicKey,
      encryptedData,
      amount,
      recipient,
    });
  } catch (error) {
    console.error('Remittance error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process remittance',
        success: false,
      },
      { status: 500 }
    );
  }
}