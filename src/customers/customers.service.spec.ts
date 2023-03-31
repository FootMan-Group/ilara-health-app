import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CustomersDto } from './dto';
import { Request } from 'express';

describe('CustomersController', () => {
  let controller: CustomersController;
  let service: CustomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: {
            CreateCustomer: jest.fn(),
            GetAllCustomers: jest.fn(),
            GetCustomerById: jest.fn(),
            GetTotalCustomers: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    service = module.get<CustomersService>(CustomersService);
  });

  describe('CreateCustomer', () => {
    it('should create a new customer', async () => {
      const mockRequest: Request = {} as Request;
      const customerDto: CustomersDto = {
        msisdn: '0123456789',
        identification_number: '1234567890',
        email: 'test@test.com',
        customer_names: 'Test Customer',
        password: 'test_password',
      };
      const mockCustomer = { ...customerDto, id: 1 };
      jest.spyOn(service, 'CreateCustomer').mockResolvedValue(mockCustomer);

      const result = await controller.CreateCustomer(customerDto, mockRequest);

      expect(service.CreateCustomer).toHaveBeenCalledWith(customerDto);
      expect(result).toEqual(mockCustomer);
    });

    it('should return an error if the customer creation fails', async () => {
      const mockRequest: Request = {} as Request;
      const customerDto: CustomersDto = {
        msisdn: '0123456789',
        identification_number: '1234567890',
        email: 'test@test.com',
        customer_names: 'Test Customer',
        password: 'test_password',
      };
      const error = new Error('Customer creation failed');
      jest.spyOn(service, 'CreateCustomer').mockRejectedValue(error);

      const result = await controller.CreateCustomer(customerDto, mockRequest);

      expect(service.CreateCustomer).toHaveBeenCalledWith(customerDto);
      expect(result).toEqual(error);
    });
  });

  describe('GetAllCustomers', () => {
    it('should return a list of customers', async () => {
      const page = 1;
      const perPage = 10;
      const mockCustomers = [
        {
          id: 1,
          msisdn: '0123456789',
          identification_number: '1234567890',
          email: 'test@test.com',
          customer_names: 'Test Customer 1',
          password: 'test_password',
        },
        {
          id: 2,
          customer_type_id: 2,
          msisdn: '0987654321',
          identification_number: '0987654321',
          email: 'test2@test.com',
          customer_names: 'Test Customer 2',
          password: 'test_password',
        },
      ];
      jest.spyOn(service, 'GetAllCustomers').mockResolvedValue(mockCustomers);
      jest
        .spyOn(service, 'GetTotalCustomers')
        .mockResolvedValue(mockCustomers.length);
      const expectedResult = {
        page,
        perPage,
        totalPages: 1,
        totalCustomers: mockCustomers.length,
        data: mockCustomers,
      };

      const result = await controller.GetAllCustomers(page, perPage);

      expect(service.GetAllCustomers).toHaveBeenCalledWith(page, perPage);
      expect(result).toEqual(expectedResult);
    });

    it('should return an error if getting the customers fails', async () => {
      const page = 1;
      const perPage = 10;
      const error = new Error('Failed to get customers');
      jest.spyOn(service, 'GetAllCustomers').mockRejectedValue(error);

      const result = await controller.GetAllCustomers(page, perPage);

      expect(service.GetAllCustomers).toHaveBeenCalledWith(page, perPage);
      expect(result).toEqual(error);
    });
  });

  describe('GetCustomerById', () => {
    it('should return a customer by ID', async () => {
      const customerId = 1;
      const mockCustomer = {
        id: customerId,
        msisdn: '0123456789',
        identification_number: '1234567890',
        email: 'test@test.com',
        customer_names: 'Test Customer',
        password: 'test_password',
        created_at: '2019-09-01',
        updated_at: '2019-09-02',
      };
      jest.spyOn(service, 'GetCustomerById').mockResolvedValue(mockCustomer);

      const result = await controller.GetCustomerById(customerId);

      expect(service.GetCustomerById).toHaveBeenCalledWith(customerId);
      expect(result).toEqual(mockCustomer);
    });

    it('should return null if no customer found', async () => {
      const customerId = 1;
      jest.spyOn(service, 'GetCustomerById').mockResolvedValue(null);

      const result = await controller.GetCustomerById(customerId);

      expect(service.GetCustomerById).toHaveBeenCalledWith(customerId);
      expect(result).toBeNull();
    });
  });
});
