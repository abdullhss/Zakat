import axios from "axios";
import { AES256Encryption } from "../utils/encryption";

const API_BASE_URL =
"http:\\\\185.207.251.48:8085/ERPDatabaseWorkFunctions";
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API Configuration
const API_CONFIG = {
  API_TOKEN: "TTRgG@i$$ol@m$Wegh77", // Private key
  PUBLIC_KEY: "SL@C$@rd2023$$AlMedad$Soft$2022$", // Public key for encryption/decryption
};

/**
 * Execute procedure with encrypted data
 */
export const executeProcedure = async (ProcedureName, procedureValues) => {
  try {
    // Data to encrypt
    const dataToEncrypt = {
      ProcedureName: ProcedureName,
      ParametersValues: procedureValues,
      DataToken: "Zakat",
    };

    // console.log("Data to encrypt:", dataToEncrypt);

    // Encrypt using public key
    const encryptedData = AES256Encryption.encrypt(
      dataToEncrypt,
      API_CONFIG.PUBLIC_KEY
    );

    // Request payload
    const payload = {
      ApiToken: API_CONFIG.API_TOKEN,
      Data: encryptedData,
    };

    // Make API call
    const response = await api.post("/ExecuteProcedure", payload);

    // Decrypt response fields
    const decryptedResponse = {};

    if (response.data.Result) {
      decryptedResponse.result = AES256Encryption.decrypt(
        response.data.Result,
        API_CONFIG.PUBLIC_KEY
      );
    }

    if (response.data.Error) {
      decryptedResponse.error = AES256Encryption.decrypt(
        response.data.Error,
        API_CONFIG.PUBLIC_KEY
      );
    }

    if (response.data.Data) {
      decryptedResponse.data = AES256Encryption.decrypt(
        response.data.Data,
        API_CONFIG.PUBLIC_KEY
      );
    }

    if (response.data.ServerTime) {
      decryptedResponse.serverTime = AES256Encryption.decrypt(
        response.data.ServerTime,
        API_CONFIG.PUBLIC_KEY
      );
    }

    // console.log("Decrypted response:", decryptedResponse.data.Result[0]);

    return {
      success: true,
      decrypted: decryptedResponse.data.Result[0],
      raw: response.data,
    };
  } catch (error) {
    console.error("API call failed:", error);
    return {
      success: false,
      error: error.message,
      details: error.response?.data,
    };
  }
};
export const DoTransaction = async (tableName, ColumnsValues , WantedAction=0 ,) => {
  try {
    // Data to encrypt
    const dataToEncrypt = {
      TableName: tableName,
      ColumnsValues: ColumnsValues,
      WantedAction:WantedAction,
      DataToken: "Zakat",
      PointId:0
    };

    console.log("Data to encrypt:", dataToEncrypt);

    // Encrypt using public key
    const encryptedData = AES256Encryption.encrypt(
      dataToEncrypt,
      API_CONFIG.PUBLIC_KEY
    );

    // Request payload
    const payload = {
      ApiToken: API_CONFIG.API_TOKEN,
      Data: encryptedData,
    };

    // Make API call
    const response = await api.post("/DoTransaction", payload);

    // Decrypt response fields
    const decryptedResponse = {};

    if (response.data.Result) {
      decryptedResponse.result = AES256Encryption.decrypt(
        response.data.Result,
        API_CONFIG.PUBLIC_KEY
      );
    }

    if (response.data.Error) {
      decryptedResponse.error = AES256Encryption.decrypt(
        response.data.Error,
        API_CONFIG.PUBLIC_KEY
      );
    }

    if (response.data.Data) {
      decryptedResponse.data = AES256Encryption.decrypt(
        response.data.Data,
        API_CONFIG.PUBLIC_KEY
      );
    }

    if (response.data.ServerTime) {
      decryptedResponse.serverTime = AES256Encryption.decrypt(
        response.data.ServerTime,
        API_CONFIG.PUBLIC_KEY
      );
    }

    console.log("Decrypted response:", decryptedResponse.result);

    return {
      success:  decryptedResponse.result,
    };
  } catch (error) {
    console.error("API call failed:", error);
    return {
      success: false,
      error: error.message,
      details: error.response?.data,
    };
  }
};
