import type { RiskLevel } from '../types';

export interface Fixture {
  id: string;
  label: string;
  text: string;
  expectedLevel: RiskLevel;
  mustInclude?: string[];
  mustNotInclude?: string[];
}

export const FIXTURES: Fixture[] = [
  {
    id: 'legit-bdo-debit',
    label: 'BDO debit alert',
    text: 'BDO: Your account ending 1234 was debited PHP 500.00 on 11/06. If not you, call the number on your card.',
    expectedLevel: 'safe',
    mustNotInclude: ['text.otp_request', 'text.credential_request'],
  },
  {
    id: 'legit-bpi-otp',
    label: 'BPI OTP notice',
    text: 'Your BPI OTP is 482913. NEVER share this code with anyone.',
    expectedLevel: 'safe',
    mustNotInclude: ['text.otp_request', 'text.credential_request'],
  },
  {
    id: 'scam-bdo-phishing',
    label: 'BDO phishing link',
    text: 'BDO ALERT: Your account has been suspended. Verify within 24 hours: http://bdo-secure-login.top/verify',
    expectedLevel: 'scam',
    mustInclude: ['url.lookalike_brand', 'text.threat'],
  },
  {
    id: 'scam-raffle-otp',
    label: 'Raffle asking for OTP',
    text: 'Congratulations! You won PHP 50,000 from SM. Claim at bit.ly/sm-claim and send your OTP to verify.',
    expectedLevel: 'scam',
    mustInclude: ['text.prize', 'text.otp_request'],
  },
  {
    id: 'scam-job-telegram',
    label: 'Work-from-home job scam',
    text: 'Earn PHP 3,000 daily, no experience needed, work from home. Message us on Telegram @hiringph',
    expectedLevel: 'suspicious',
    mustInclude: ['text.job_scam_pattern'],
  },
  {
    id: 'scam-parcel-fee',
    label: 'Parcel fee scam',
    text: 'Your parcel is on hold. Pay the PHP 50 fee here: http://phlpost-delivery.xyz/pay',
    expectedLevel: 'scam',
    mustInclude: ['url.lookalike_brand'],
  },
  {
    id: 'legit-gcash-receipt',
    label: 'GCash receipt',
    text: 'GCash: You have received PHP 1,200.00 from JUAN D. Ref No. 0123456789.',
    expectedLevel: 'safe',
  },
  {
    id: 'legit-maya-receipt',
    label: 'Maya receipt',
    text: 'Maya: Payment of PHP 350.00 to Jollibee was successful. Ref 998877.',
    expectedLevel: 'safe',
  },
  {
    id: 'legit-metrobank-alert',
    label: 'Metrobank withdrawal alert',
    text: 'Metrobank: A withdrawal of PHP 2,000.00 was made from your account. If unrecognized, call the Metrobank hotline.',
    expectedLevel: 'safe',
  },
  {
    id: 'legit-landbank-credit',
    label: 'Landbank credit alert',
    text: 'Landbank: PHP 15,000.00 was credited to your account ending 5678. Thank you.',
    expectedLevel: 'safe',
  },
  {
    id: 'legit-unionbank-otp',
    label: 'UnionBank OTP notice',
    text: 'UnionBank: Your one-time PIN is 778812. Do not share it with anyone.',
    expectedLevel: 'safe',
    mustNotInclude: ['text.otp_request'],
  },
  {
    id: 'legit-dhl-delivery',
    label: 'DHL delivery notice',
    text: 'DHL: Your parcel 123456 will be delivered today between 9AM and 5PM. No fee is required.',
    expectedLevel: 'safe',
  },
  {
    id: 'legit-jnt-pickup',
    label: 'J&T pickup notice',
    text: 'J&T Express: Your package is ready for pickup at the branch. Bring a valid ID.',
    expectedLevel: 'safe',
  },
  {
    id: 'legit-lalamove-rider',
    label: 'Lalamove rider update',
    text: 'Lalamove: Your rider is 5 minutes away. Order 8832.',
    expectedLevel: 'safe',
  },
  {
    id: 'legit-meralco-bill',
    label: 'Meralco bill',
    text: 'Meralco: Your bill for November is PHP 2,345.00, due on Nov 20. Pay via the Meralco app.',
    expectedLevel: 'safe',
  },
  {
    id: 'legit-maynilad-bill',
    label: 'Maynilad bill',
    text: 'Maynilad: Your water bill of PHP 780.00 is due on Nov 25. View it in the Maynilad app.',
    expectedLevel: 'safe',
  },
  {
    id: 'legit-globe-load',
    label: 'Globe load confirmation',
    text: 'Globe: You have successfully loaded PHP 100. Your new balance is PHP 245.',
    expectedLevel: 'safe',
  },
  {
    id: 'legit-smart-promo',
    label: 'Smart promo notice',
    text: 'Smart: Your 5GB data promo is active until Nov 30. Enjoy!',
    expectedLevel: 'safe',
  },
  {
    id: 'legit-sss-notice',
    label: 'SSS contribution notice',
    text: 'SSS: Your contribution for October has been posted. View your records in the SSS mobile app.',
    expectedLevel: 'safe',
  },
  {
    id: 'legit-pagibig-notice',
    label: 'Pag-IBIG payment notice',
    text: 'Pag-IBIG: Your housing loan payment was received. Thank you.',
    expectedLevel: 'safe',
  },
  {
    id: 'legit-philhealth-notice',
    label: 'PhilHealth premium notice',
    text: 'PhilHealth: Your premium payment for 2026 is posted.',
    expectedLevel: 'safe',
  },
  {
    id: 'legit-bir-receipt',
    label: 'BIR e-receipt',
    text: 'BIR: Your e-receipt for PHP 1,500.00 has been issued. Reference 7788.',
    expectedLevel: 'safe',
  },
  {
    id: 'legit-shopee-delivery',
    label: 'Shopee shipping notice',
    text: 'Shopee: Your order has shipped and will arrive in 2-3 days. Track it in the Shopee app.',
    expectedLevel: 'safe',
  },
  {
    id: 'legit-bank-advisory',
    label: 'Bank security advisory',
    text: 'BDO Advisory: We will never ask for your OTP or password. Report suspicious messages to our official hotline.',
    expectedLevel: 'safe',
    mustNotInclude: ['text.otp_request', 'text.credential_request'],
  },
  {
    id: 'scam-punycode-bank',
    label: 'Punycode bank link',
    text: 'BPI: Verify your account at xn--bpi-9na.com/login',
    expectedLevel: 'scam',
    mustInclude: ['url.punycode'],
  },
  {
    id: 'scam-ip-link',
    label: 'IP address login link',
    text: 'GCash: Your account is blocked. Login at http://203.0.113.9/gcash',
    expectedLevel: 'scam',
    mustInclude: ['url.ip_literal'],
  },
  {
    id: 'scam-shortener-otp',
    label: 'Shortener plus OTP request',
    text: 'Your BDO account needs verification. Click bit.ly/verify-bdo and enter your OTP.',
    expectedLevel: 'scam',
    mustInclude: ['text.otp_request', 'url.shortener'],
  },
  {
    id: 'scam-subdomain-trick',
    label: 'Brand in subdomain trick',
    text: 'BDO: Your account is suspended. Update your details at bdo.com.ph.evil.xyz/secure.',
    expectedLevel: 'scam',
    mustInclude: ['url.brand_in_subdomain'],
  },
  {
    id: 'scam-nbi-impersonation',
    label: 'NBI impersonation',
    text: 'NBI: May pending case ka. Magbayad ng PHP 5,000 sa loob ng 24 hours o maaresto ka. Tawagan ang 0917 555 1234.',
    expectedLevel: 'scam',
    mustInclude: ['text.impersonation'],
  },
  {
    id: 'scam-load-advance',
    label: 'Load advance-fee scam',
    text: 'Congrats! You won PHP 10,000 load. Send PHP 500 load to 0917 123 4567 to claim.',
    expectedLevel: 'suspicious',
    mustInclude: ['text.prize', 'text.money_request'],
  },
  {
    id: 'scam-bir-fake',
    label: 'Fake BIR refund',
    text: 'BIR: Your tax refund of PHP 8,000 is ready. Verify at bir-refund.top and enter your bank account number.',
    expectedLevel: 'scam',
    mustInclude: ['text.credential_request'],
  },
  {
    id: 'scam-gcash-cashin',
    label: 'GCash mistaken transfer',
    text: 'GCash: Someone sent you PHP 5,000 by mistake. Cash in and send it back to 0917 888 9999.',
    expectedLevel: 'suspicious',
  },
  {
    id: 'scam-otp-notification-fake',
    label: 'Fake OTP share request',
    text: 'Your OTP is 552211. To complete verification, share your OTP with our agent.',
    expectedLevel: 'scam',
    mustInclude: ['text.otp_request'],
  },
  {
    id: 'scam-credential-bank',
    label: 'Credential harvesting',
    text: 'Security alert: Provide your account number and password to restore access.',
    expectedLevel: 'scam',
    mustInclude: ['text.credential_request'],
  },
  {
    id: 'scam-prize-fee',
    label: 'Prize processing fee',
    text: 'You are our lucky winner! Final notice: pay the PHP 200 processing fee to release your prize.',
    expectedLevel: 'scam',
    mustInclude: ['text.advance_fee_pattern'],
  },
  {
    id: 'scam-pldt-fake',
    label: 'Fake PLDT billing',
    text: 'PLDT: Your internet will be disconnected today. Pay via pldt-billing.xyz to avoid interruption.',
    expectedLevel: 'scam',
    mustInclude: ['url.lookalike_brand'],
  },
  {
    id: 'scam-lazada-refund',
    label: 'Fake Lazada refund',
    text: 'Lazada: Your refund is ready. Confirm your card number at lazada-refund.click.',
    expectedLevel: 'scam',
    mustInclude: ['url.lookalike_brand'],
  },
  {
    id: 'scam-meralco-disconnection',
    label: 'Fake Meralco disconnection',
    text: 'Meralco: Disconnection notice. Your account is overdue. Pay immediately via http://meralco-pay.xyz',
    expectedLevel: 'scam',
    mustInclude: ['url.lookalike_brand'],
  },
  {
    id: 'scam-sss-loan',
    label: 'Fake SSS loan',
    text: 'SSS: Approved loan of PHP 20,000. Claim via sss-loan.online and send your PIN.',
    expectedLevel: 'scam',
    mustInclude: ['text.otp_request'],
  },
  {
    id: 'scam-spoofed-bank-shortener',
    label: 'Spoofed bank with shortener',
    text: 'BPI: We detected unusual activity. Confirm your identity at tinyurl.com/bpi-verify and provide your password.',
    expectedLevel: 'scam',
    mustInclude: ['text.credential_request', 'url.shortener'],
  },
];

export const CURATED_EXAMPLES = FIXTURES.slice(0, 7);
