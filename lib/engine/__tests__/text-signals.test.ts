import { describe, it, expect } from 'vitest';
import { detectTextSignals } from '../signals/text';

const ids = (s: string) => detectTextSignals(s).map((x) => x.id);

describe('detectTextSignals', () => {
  it('treats an OTP notification as safe but a request to share it as critical', () => {
    expect(ids('Your BPI OTP is 123456. Never share this code.')).not.toContain(
      'text.otp_request',
    );
    expect(ids('Send your OTP to verify your account')).toContain('text.otp_request');
  });

  it('detects prize, money, and advance-fee scams', () => {
    expect(ids('Congratulations! You won 50,000 pesos. Claim now.')).toContain('text.prize');
    expect(ids('Send load or cash in to claim')).toContain('text.money_request');
  });

  it('detects credential and impersonation requests', () => {
    expect(ids('Enter your password and CVV here')).toContain('text.credential_request');
    expect(ids('BDO: your account is suspended, verify now')).toContain('text.impersonation');
  });

  it('detects job offers, off-platform contact, urgency, and Taglish urgency', () => {
    expect(ids('Earn 3000 daily, no experience needed, WFH')).toContain('text.job_offer');
    expect(ids('Message us on Telegram')).toContain('text.contact_offsite');
    expect(ids('Final notice: act now within 24 hours')).toContain('text.urgency');
    expect(ids('Bilisan mo, i-click agad ngayon na')).toContain('text.taglish_urgency');
  });

  it('returns no signals for an ordinary message', () => {
    expect(ids('Kumain ka na ba?')).toEqual([]);
  });
});
