import { NextFunction, Request, RequestHandler, Response } from 'express';

export interface JsonFormatterError {
    code: string;
    message: string;
}

export interface JsonFormatterEnvelope {
    data?: any;
    errors?: JsonFormatterError[];
}

export interface JsonFormatter {
    formattedJson(err: Error, data: any): void;
}

export interface JsonFormatterErrorStatus {
    [key: string]: number;
}

export default function jsonFormatter(
    errorStatus: JsonFormatterErrorStatus = {}
): RequestHandler {
    return (
        req: Request,
        res: Response & JsonFormatter,
        next: NextFunction
    ) => {
        res.formattedJson = (err: Error, data: any) => {
            const result: JsonFormatterEnvelope = {};
            if (err) {
                const { status, name, message } = err as any;
                res.status(status || errorStatus[name] || 500);
                result.errors = [{ code: name, message }];
            } else {
                result.data = data;
            }
            res.json(result);
        };
        next();
    };
}
