declare global {
  export class ShellThreeDS2Service {
      initialize(initializeSpec: InitializeSpec, initializeCallback: InitializeCallback): void;
      authenticate(authenticateSpec: AuthenticateSpec, authenticateCallback: AuthenticateCallback): void;
  }
  export interface InitializeCallback {
      onSuccess(): void;
      onFailure(error: Error): void;
  }
  export interface AuthenticateSpec {
      userId?: string;
      cardId: string;
      orderId: string;
      exchangeTransactionDetailsUrl: string;
      transactionResultUrl: string;
      iframeRef: HTMLIFrameElement;
      splitSdkServerUrl: string;
      threeDsData: ThreeDsData;
      merchantAuthInfo?: string;
      token?: string;
  }
  export interface AuthenticateCallback {
      authenticated(authenticationResult: AuthenticationResult): void;
      notAuthenticated(authenticationResult: AuthenticationResult): void;
      decoupledAuthBeingPerformed(authenticationResult: AuthenticationResult): void;
      cancelled(authenticationResult: AuthenticationResult): void;
      error(authenticationResult: AuthenticationResult): void;
  }
  export interface TransactionResult {
      callbackMethod: 'authenticated' | 'notAuthenticated' | 'decoupledAuthBeingPerformed' | 'cancelled' | 'error';
      authenticationResult: {
          [key: string]: any;
      };
  }
  export interface AuthenticationResult {
      splitSdkServerTransID?: string;
      threeDSServerTransID?: string;
      status?: string;
      cardholderInfo?: string;
      errorDescription?: string;
      errorCode?: string;
      errorDetails?: string;
  }

  export class ThreeDsData {
      addCustomDataField(key: string, value: any): this;
      threeDSRequestorAuthenticationInd(threeDSRequestorAuthenticationInd: string): this;
      threeDSRequestorAuthenticationInfo(threeDSRequestorAuthenticationInfo: ThreeDSRequestorAuthenticationInfo[]): this;
      threeDSRequestorChallengeInd(threeDSRequestorChallengeInd: string): this;
      threeDSRequestorID(threeDSRequestorID: string): this;
      threeDSRequestorName(threeDSRequestorName: string): this;
      threeDSRequestorPriorAuthenticationInfo(threeDSRequestorPriorAuthenticationInfo: ThreeDsRequestorPriorAuthenticationInfo): this;
      threeDSRequestorURL(threeDSRequestorURL: string): this;
      acquirerBIN(acquirerBIN: string): this;
      acquirerMerchantID(acquirerMerchantID: string): this;
      addrMatch(addrMatch: string): this;
      cardExpiryDate(cardExpiryDate: string): this;
      acctInfo(acctInfo: AcctInfo): this;
      acctNumber(acctNumber: string): this;
      acctID(acctID: string): this;
      billAddrCity(billAddrCity: string): this;
      billAddrCountry(billAddrCountry: string): this;
      billAddrLine1(billAddrLine1: string): this;
      billAddrLine2(billAddrLine2: string): this;
      billAddrLine3(billAddrLine3: string): this;
      billAddrPostCode(billAddrPostCode: string): this;
      billAddrState(billAddrState: string): this;
      email(email: string): this;
      homePhone(homePhone: Phone): this;
      mobilePhone(mobilePhone: Phone): this;
      cardholderName(cardholderName: string): this;
      shipAddrCity(shipAddrCity: string): this;
      shipAddrCountry(shipAddrCountry: string): this;
      shipAddrLine1(shipAddrLine1: string): this;
      shipAddrLine2(shipAddrLine2: string): this;
      shipAddrLine3(shipAddrLine3: string): this;
      shipAddrPostCode(shipAddrPostCode: string): this;
      shipAddrState(shipAddrState: string): this;
      workPhone(workPhone: Phone): this;
      purchaseInstalData(purchaseInstalData: string): this;
      mcc(mcc: string): this;
      merchantCountryCode(merchantCountryCode: string): this;
      merchantName(merchantName: string): this;
      merchantRiskIndicator(merchantRiskIndicator: MerchantRiskIndicator): this;
      messageCategory(messageCategory: string): this;
      purchaseAmount(purchaseAmount: string): this;
      purchaseCurrency(purchaseCurrency: string): this;
      purchaseExponent(purchaseExponent: string): this;
      purchaseDate(purchaseDate: string): this;
      recurringExpiry(recurringExpiry: string): this;
      recurringFrequency(recurringFrequency: string): this;
      transType(transType: string): this;
  }
  interface Phone {
      cc: string;
      subscriber: string;
  }

  export class ThreeDSRequestorAuthenticationInfo {
      threeDSReqAuthData(threeDSReqAuthData: string): this;
      threeDSReqAuthMethod(threeDSReqAuthMethod: string): this;
      threeDSReqAuthTimestamp(threeDSReqAuthTimestamp: string): this;
  }

  export class ThreeDsRequestorPriorAuthenticationInfo {
      threeDSReqPriorAuthData(threeDSReqPriorAuthData: string): this;
      threeDSReqPriorAuthMethod(threeDSReqPriorAuthMethod: string): this;
      threeDSReqPriorAuthTimestamp(threeDSReqPriorAuthTimestamp: string): this;
      threeDSReqPriorRef(threeDSReqPriorRef: string): this;
  }

  export class AcctInfo {
      chAccAgeInd(chAccAgeInd: string): this;
      chAccChange(chAccChange: string): this;
      chAccChangeInd(chAccChangeInd: string): this;
      chAccDate(chAccDate: string): this;
      chAccReqID(chAccReqID: string): this;
      chAccPwChange(chAccPwChange: string): this;
      chAccPwChangeInd(chAccPwChangeInd: string): this;
      nbPurchaseAccount(nbPurchaseAccount: string): this;
      provisionAttemptsDay(provisionAttemptsDay: string): this;
      txnActivityDay(txnActivityDay: string): this;
      txnActivityYear(txnActivityYear: string): this;
      paymentAccAge(paymentAccAge: string): this;
      paymentAccInd(paymentAccInd: string): this;
      shipAddressUsage(shipAddressUsage: string): this;
      shipAddressUsageInd(shipAddressUsageInd: string): this;
      shipNameIndicator(shipNameIndicator: string): this;
      suspiciousAccActivity(suspiciousAccActivity: string): this;
  }

  export class MerchantRiskIndicator {
      deliveryEmailAddress(deliveryEmailAddress: string): this;
      deliveryTimeframe(deliveryTimeframe: string): this;
      giftCardAmount(giftCardAmount: string): this;
      giftCardCount(giftCardCount: string): this;
      giftCardCurr(giftCardCurr: string): this;
      preOrderDate(preOrderDate: string): this;
      preOrderPurchaseInd(preOrderPurchaseInd: string): this;
      reorderItemsInd(reorderItemsInd: string): this;
      shipIndicator(shipIndicator: string): this;
  }

  export class InitializeSpec {
      private _configParameters;
      constructor();
      getConfigParameters(): ConfigParameters;
      setConfigParameters(configParameters: ConfigParameters): void;
  }

  export class ConfigParameters {
      private static readonly DEFAULT_GROUP_KEY;
      parameters: Map<string, Map<string, string>>;
      constructor();
      addParam(group: string | null | undefined, paramName: string | null | undefined, paramValue: string | null | undefined): void;
      getParamValue(group: string | null | undefined, paramName: string | undefined): string | null;
      removeParam(group: string | null | undefined, paramName: string | undefined): boolean | null;
  }
}

export {}
