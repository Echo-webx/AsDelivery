import {
	isMongoId,
	registerDecorator,
	ValidationArguments,
	ValidationOptions
} from 'class-validator'

export function IsMongoIdOrAll(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'isMongoIdOrAll',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					return (
						typeof value === 'string' && (value === 'all' || isMongoId(value))
					)
				},
				defaultMessage(args: ValidationArguments) {
					return `${args.property} must be either 'all' or a valid MongoId`
				}
			}
		})
	}
}
