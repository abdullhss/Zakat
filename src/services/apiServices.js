import axios from "axios";
import { AES256Encryption } from "../utils/encryption";

//"https://client-frw.almedadsoft.com/emsserver.dll/ERPDatabaseWorkFunctions";

const API_BASE_URL =
"https://framework.md-license.com:8093/emsserver.dll/ERPDatabaseWorkFunctions";
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

    // 

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

    // 

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
export const RequireAuthentication = async (FunctionName, ProcedureName , ParametersValue , AuthType,SendTo) => {
  try {
    // Data to encrypt
    const dataToEncrypt = {
      FunctionName: FunctionName,
      ProcedureName: ProcedureName,
      ParametersValue:`${ParametersValue}#$????`,
      AuthType:AuthType,
      SendTo:SendTo,
      DataToken: "Zakat",
    };

    

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
    const response = await api.post("/RequireAuthentication", payload);

    // Decrypt response fields
    const decryptedResponse = {};

    if (response.data.Result) {
      decryptedResponse.result = AES256Encryption.decrypt(
        response.data.Result,
        API_CONFIG.PUBLIC_KEY
      );
    }
    
    if (response.data.TransToken) {
      decryptedResponse.TransToken = response.data.TransToken
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

    

    return {
      success:  decryptedResponse.result,
      TransToken: decryptedResponse.TransToken,
      error : decryptedResponse.error
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
export const ExecuteAuthentication = async (TransToken   , VerCode    ) => {
  try {
    // Data to encrypt
    const dataToEncrypt = {
      TransToken   : TransToken   ,
      VerCode    : VerCode    ,
      DataToken: "Zakat"
    };

    

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
    const response = await api.post("/ExecuteAuthentication", payload);

    // Decrypt response fields
    const decryptedResponse = {};

    if (response.data.Result) {
      decryptedResponse.result = AES256Encryption.decrypt(
        response.data.Result,
        API_CONFIG.PUBLIC_KEY
      );
    }
    
    if (response.data.TransToken) {
      decryptedResponse.TransToken = response.data.TransToken
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

    

    return {
      success:  decryptedResponse.result,
      TransToken: decryptedResponse.TransToken,
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