import { Request, Response, NextFunction } from "express";
import { XMLParserService } from "../services/xml-parser.service";
import { RESTParserService } from "../services/rest-parser.service";
import { NormalizerService } from "../services/normalizer.service";

class MVNOController {
  constructor(
    private readonly xmlParser: XMLParserService,
    private readonly restParser: RESTParserService,
    private readonly normalizer: NormalizerService
  ) {}

  normalizeSoapCharge = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const xmlString = req.body.xml as string;

      // SOAP requires XML string - catch before parser
      if (!xmlString) {
        res.status(400).json({ error: "XML string is required in body.xml" });
        return;
      }

      const soapCharge = this.xmlParser.parseSOAPCharge(xmlString);

      const normalized = this.normalizer.normalizeSOAPChargeSMS(soapCharge);

      res.status(200).json(normalized);
    } catch (error) {
      // Pass to centralized error handler
      next(error);
    }
  };

  normalizeRestUsage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = req.body;

      const restData = this.restParser.validateRESTDataUsage(data);

      const normalized = this.normalizer.normalizeRESTDataUsage(restData);

      res.status(200).json(normalized);
    } catch (error) {
      // Pass to centralized error handler
      next(error);
    }
  };
}

// Export singleton instance
export const mvnoController = new MVNOController(
  new XMLParserService(),
  new RESTParserService(),
  new NormalizerService()
);
