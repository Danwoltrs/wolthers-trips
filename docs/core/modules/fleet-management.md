# Fleet Management Module Specification

## 🎯 Overview
The fleet management module handles vehicle tracking, driver accountability, maintenance scheduling, expense management, and AI-powered dashboard photo processing for comprehensive vehicle oversight.

## 🚗 Vehicle Management System

### Vehicle Types & Categories
```typescript
enum VehicleType {
  SEDAN = 'sedan',
  COMPACT_SUV = 'compact_suv',    // Small SUVs (Honda CR-V, Toyota RAV4)
  SUV = 'suv',                    // Standard SUVs (Honda Pilot, Ford Explorer)
  FULL_SIZE_SUV = 'full_size_suv', // Large luxury SUVs (Land Rover Discovery, Cadillac Escalade)
  OFF_ROAD_SUV = 'off_road_suv',   // Off-road capable (Jeep Wrangler, Ford Bronco)
  TRUCK = 'truck',                 // Pickup trucks
  VAN = 'van',                     // Passenger/cargo vans
  MOTORCYCLE = 'motorcycle',
  RENTAL = 'rental'               // Any rental vehicle
}

// Vehicle classification for coffee business context
interface VehicleClassification {
  terrain_capability: {
    urban: ['sedan', 'compact_suv', 'suv'];
    rural_roads: ['suv', 'full_size_suv', 'truck'];
    farm_access: ['off_road_suv', 'truck', 'full_size_suv'];
    mountain_terrain: ['off_road_suv', 'truck'];
  };
  
  passenger_capacity: {
    individual: ['sedan', 'compact_suv'];
    small_group: ['suv', 'full_size_suv'];
    large_group: ['van', 'full_size_suv'];
  };
  
  cargo_capability: {
    samples_documents: ['sedan', 'compact_suv', 'suv'];
    equipment_supplies: ['suv', 'full_size_suv', 'truck', 'van'];
    bulk_cargo: ['truck', 'van'];
  };
}

enum VehicleStatus {
  AVAILABLE = 'available',
  IN_USE = 'in_use',
  MAINTENANCE = 'maintenance',
  OUT_OF_SERVICE = 'out_of_service',
  RETIRED = 'retired'
}
```

### Vehicle Ownership Model
```typescript
interface VehicleOwnership {
  // Company-owned vehicles
  company_owned: {
    full_ownership: FullOwnershipVehicle;
    leased: LeasedVehicle;
    financed: FinancedVehicle;
  };
  
  // Third-party vehicles
  third_party: {
    rental_cars: RentalCarIntegration;
    employee_personal: EmployeePersonalVehicle;
    contractor_vehicles: ContractorVehicle;
    client_provided: ClientProvidedVehicle;
  };
  
  // Tracking requirements
  tracking_requirements: {
    gps_tracking: GPSTrackingRequirement;
    mileage_logging: MileageLoggingRequirement;
    fuel_tracking: FuelTrackingRequirement;
    maintenance_tracking: MaintenanceTrackingRequirement;
  };
}
```

## 🗄️ Database Schema

### Vehicles Table
```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  color VARCHAR(50),
  license_plate VARCHAR(20) UNIQUE,
  vin VARCHAR(50),
  vehicle_type vehicle_type_enum DEFAULT 'suv',
  ownership_type ownership_type_enum DEFAULT 'company_owned',
  mileage INTEGER DEFAULT 0,
  current_odometer INTEGER DEFAULT 0,
  fuel_capacity DECIMAL(6,2) DEFAULT 60.0,
  fuel_type VARCHAR(50) DEFAULT 'Regular',
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  maintenance_interval_miles INTEGER DEFAULT 5000,
  status vehicle_status_enum DEFAULT 'available',
  insurance_company VARCHAR(255),
  insurance_policy VARCHAR(100),
  insurance_expiry DATE,
  registration_expiry DATE,
  gps_tracking BOOLEAN DEFAULT FALSE,
  gps_device_id VARCHAR(100),
  maintenance_alerts JSONB DEFAULT '{}',
  purchase_date DATE,
  purchase_price DECIMAL(12,2),
  current_value DECIMAL(12,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Vehicle Logs Table
```sql
CREATE TABLE vehicle_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES users(id),
  driver_name VARCHAR(255) NOT NULL,
  driver_license VARCHAR(50),
  driver_phone VARCHAR(20),
  driver_type driver_type_enum DEFAULT 'employee',
  log_type log_type_enum DEFAULT 'trip_start',
  odometer_start INTEGER,
  odometer_end INTEGER,
  kilometers_driven INTEGER GENERATED ALWAYS AS (odometer_end - odometer_start) STORED,
  fuel_level_start INTEGER CHECK (fuel_level_start >= 0 AND fuel_level_start <= 100),
  fuel_level_end INTEGER CHECK (fuel_level_end >= 0 AND fuel_level_end <= 100),
  dashboard_photo_start TEXT,
  dashboard_photo_end TEXT,
  start_location VARCHAR(255),
  end_location VARCHAR(255),
  start_coordinates POINT,
  end_coordinates POINT,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  route_notes TEXT,
  vehicle_condition_start TEXT,
  vehicle_condition_end TEXT,
  incidents JSONB DEFAULT '[]',
  ai_extracted_data JSONB DEFAULT '{}',
  verification_status verification_status_enum DEFAULT 'pending',
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Driver Expenses Table
```sql
CREATE TABLE driver_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_log_id UUID REFERENCES vehicle_logs(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES users(id),
  vehicle_id UUID REFERENCES vehicles(id),
  expense_type driver_expense_type_enum NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  usd_amount DECIMAL(10,2),
  exchange_rate DECIMAL(8,4),
  merchant_name VARCHAR(255),
  receipt_url TEXT,
  card_id UUID REFERENCES payment_cards(id),
  odometer_reading INTEGER,
  fuel_liters DECIMAL(6,2),
  fuel_type VARCHAR(50),
  price_per_unit DECIMAL(6,3),
  transaction_date TIMESTAMP WITH TIME ZONE,
  location VARCHAR(255),
  coordinates POINT,
  approval_status approval_status_enum DEFAULT 'pending',
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  reimbursement_status reimbursement_status_enum DEFAULT 'pending',
  ai_extracted_data JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Vehicle Maintenance Table
```sql
CREATE TABLE vehicle_maintenance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  maintenance_type maintenance_type_enum NOT NULL,
  description TEXT NOT NULL,
  scheduled_date DATE,
  completed_date DATE,
  odometer_reading INTEGER,
  cost DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  service_provider VARCHAR(255),
  service_location VARCHAR(255),
  warranty_until DATE,
  parts_replaced JSONB DEFAULT '[]',
  labor_hours DECIMAL(4,2),
  next_service_due INTEGER, -- odometer reading
  next_service_date DATE,
  status maintenance_status_enum DEFAULT 'scheduled',
  priority priority_level_enum DEFAULT 'medium',
  performed_by UUID REFERENCES users(id),
  authorized_by UUID REFERENCES users(id),
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🏗️ Component Architecture

### Fleet Management Pages
```
/fleet/
├── page.tsx                    # Fleet overview dashboard
├── vehicles/
│   ├── page.tsx               # Vehicle list
│   ├── create/
│   │   └── page.tsx           # Add new vehicle
│   └── [id]/
│       ├── page.tsx           # Vehicle details
│       ├── edit/
│       │   └── page.tsx       # Edit vehicle
│       ├── logs/
│       │   └── page.tsx       # Vehicle logs
│       ├── maintenance/
│       │   └── page.tsx       # Maintenance history
│       └── expenses/
│           └── page.tsx       # Vehicle expenses
├── drivers/
│   ├── page.tsx               # Driver management
│   ├── register/
│   │   └── page.tsx           # Register external driver
│   └── [id]/
│       ├── page.tsx           # Driver profile
│       ├── logs/
│       │   └── page.tsx       # Driver logs
│       └── performance/
│           └── page.tsx       # Driver performance
├── logs/
│   ├── page.tsx               # All vehicle logs
│   ├── create/
│   │   └── page.tsx           # Create log entry
│   └── [id]/
│       ├── page.tsx           # Log details
│       └── verify/
│           └── page.tsx       # Log verification
├── maintenance/
│   ├── page.tsx               # Maintenance dashboard
│   ├── schedule/
│   │   └── page.tsx           # Schedule maintenance
│   └── [id]/
│       └── page.tsx           # Maintenance details
└── analytics/
    ├── page.tsx               # Fleet analytics
    ├── costs/
    │   └── page.tsx           # Cost analysis
    └── performance/
        └── page.tsx           # Performance metrics
```

### Component Structure
```typescript
FleetManagement
├── FleetDashboard
│   ├── VehicleOverview
│   ├── MaintenanceAlerts
│   ├── CostSummary
│   └── PerformanceMetrics
├── VehicleManagement
│   ├── VehicleList
│   ├── VehicleForm
│   ├── VehicleDetails
│   └── VehicleAssignment
├── DriverSystem
│   ├── DriverRegistration
│   ├── DriverVerification
│   ├── DriverPerformance
│   └── ThirdPartyDrivers
├── LoggingSystem
│   ├── TripLogger
│   ├── DashboardPhotoCapture
│   ├── AIDataExtraction
│   └── LogVerification
├── MaintenanceManager
│   ├── MaintenanceScheduler
│   ├── ServiceTracking
│   ├── CostTracking
│   └── WarrantyManagement
└── FleetAnalytics
    ├── CostAnalysis
    ├── PerformanceAnalysis
    ├── UtilizationAnalysis
    └── PredictiveAnalytics
```

## 🔧 Driver Management System

### Driver Types & Verification
```typescript
interface DriverManagement {
  // Driver categories
  driver_types: {
    wolthers_employee: {
      verification: 'automatic_from_hr';
      permissions: 'full_access';
      accountability: 'employee_standards';
      insurance: 'company_coverage';
    };
    
    third_party_contractor: {
      verification: 'manual_approval_required';
      permissions: 'restricted_access';
      accountability: 'contractor_agreement';
      insurance: 'verification_required';
    };
    
    temporary_driver: {
      verification: 'supervisor_approval';
      permissions: 'single_trip_access';
      accountability: 'enhanced_logging';
      insurance: 'case_by_case';
    };
    
    external_partner: {
      verification: 'partner_agreement';
      permissions: 'partner_specific';
      accountability: 'partner_standards';
      insurance: 'partner_coverage';
    };
  };
  
  // Driver verification process
  verification_process: {
    documentation: DriverDocumentationRequirements;
    background_check: BackgroundCheckRequirements;
    insurance_verification: InsuranceVerificationProcess;
    approval_workflow: DriverApprovalWorkflow;
  };
  
  // Performance tracking
  performance_tracking: {
    driving_metrics: DrivingMetricsTracking;
    fuel_efficiency: FuelEfficiencyScoring;
    maintenance_impact: MaintenanceImpactAnalysis;
    cost_responsibility: CostResponsibilityTracking;
  };
}
```

### Driver Registration Workflow
```typescript
interface DriverRegistrationWorkflow {
  // Registration steps
  registration_steps: {
    step1: {
      title: 'Personal Information';
      fields: ['full_name', 'phone', 'email', 'emergency_contact'];
    };
    
    step2: {
      title: 'License Verification';
      fields: ['license_number', 'license_class', 'expiry_date', 'license_photo'];
    };
    
    step3: {
      title: 'Insurance Documentation';
      fields: ['insurance_company', 'policy_number', 'coverage_amount', 'insurance_certificate'];
    };
    
    step4: {
      title: 'Vehicle Assignment';
      fields: ['authorized_vehicles', 'access_level', 'restrictions'];
    };
    
    step5: {
      title: 'Agreement & Approval';
      fields: ['driver_agreement', 'supervisor_approval', 'background_check'];
    };
  };
  
  // Approval workflow
  approval_workflow: {
    automatic_approval: AutomaticApprovalCriteria;
    manual_review: ManualReviewProcess;
    supervisor_approval: SupervisorApprovalRequired;
    final_authorization: FinalAuthorizationGrant;
  };
}
```

## 📱 AI Dashboard Photo Processing

### Advanced Dashboard OCR
```typescript
interface DashboardPhotoProcessor {
  // Image processing capabilities
  image_processing: {
    automatic_rotation: AutomaticRotationCorrection;
    glare_reduction: GlareReductionAlgorithm;
    focus_enhancement: FocusEnhancementFilter;
    contrast_optimization: ContrastOptimizationAI;
  };
  
  // OCR extraction
  ocr_extraction: {
    odometer_reading: {
      digital_display: DigitalOdometerOCR;
      analog_gauge: AnalogOdometerAI;
      partial_visibility: PartialNumberRecognition;
      validation_rules: OdometerValidationRules;
    };
    
    fuel_gauge: {
      analog_gauge: AnalogFuelGaugeAI;
      digital_display: DigitalFuelDisplayOCR;
      percentage_calculation: FuelPercentageCalculation;
      tank_capacity_correlation: TankCapacityCorrelation;
    };
    
    warning_lights: {
      check_engine: CheckEngineDetection;
      maintenance_due: MaintenanceDueDetection;
      low_fuel: LowFuelWarningDetection;
      system_alerts: SystemAlertDetection;
    };
    
    dashboard_condition: {
      cleanliness_assessment: CleanlinessAssessment;
      damage_detection: DamageDetection;
      wear_indicators: WearIndicatorAnalysis;
      overall_condition: OverallConditionScoring;
    };
  };
  
  // Validation and verification
  validation_system: {
    data_consistency: DataConsistencyChecking;
    historical_comparison: HistoricalDataComparison;
    anomaly_detection: AnomalyDetectionSystem;
    manual_review_triggers: ManualReviewTriggers;
  };
}
```

### Photo Processing Workflow
```typescript
interface PhotoProcessingWorkflow {
  // Capture workflow
  capture_workflow: {
    pre_trip_photos: {
      required_angles: ['dashboard_overview', 'odometer_close', 'fuel_gauge'];
      quality_checks: QualityChecks;
      retake_prompts: RetakePrompts;
      ai_guidance: AIGuidanceSystem;
    };
    
    post_trip_photos: {
      comparison_mode: ComparisonMode;
      difference_detection: DifferenceDetection;
      completion_verification: CompletionVerification;
      final_validation: FinalValidation;
    };
  };
  
  // Processing pipeline
  processing_pipeline: {
    image_upload: ImageUploadHandler;
    ai_processing: AIProcessingEngine;
    data_extraction: DataExtractionEngine;
    validation_checks: ValidationChecks;
    human_review: HumanReviewQueue;
    final_approval: FinalApprovalProcess;
  };
  
  // Quality assurance
  quality_assurance: {
    accuracy_scoring: AccuracyScoring;
    confidence_thresholds: ConfidenceThresholds;
    manual_review_criteria: ManualReviewCriteria;
    continuous_learning: ContinuousLearningSystem;
  };
}
```

## 🔧 Maintenance Management

### Predictive Maintenance System
```typescript
interface PredictiveMaintenanceSystem {
  // Maintenance scheduling
  maintenance_scheduling: {
    mileage_based: {
      oil_change: { interval: 5000, tolerance: 500 };
      tire_rotation: { interval: 7500, tolerance: 750 };
      brake_inspection: { interval: 15000, tolerance: 1500 };
      major_service: { interval: 30000, tolerance: 2000 };
    };
    
    time_based: {
      annual_inspection: { interval: '12_months', advance_notice: '30_days' };
      registration_renewal: { interval: '12_months', advance_notice: '60_days' };
      insurance_renewal: { interval: '12_months', advance_notice: '45_days' };
    };
    
    condition_based: {
      brake_wear: BrakeWearMonitoring;
      tire_wear: TireWearAssessment;
      fluid_levels: FluidLevelTracking;
      performance_degradation: PerformanceDegradationDetection;
    };
  };
  
  // Cost optimization
  cost_optimization: {
    vendor_comparison: VendorComparisonSystem;
    bulk_discounts: BulkDiscountTracking;
    warranty_utilization: WarrantyUtilizationOptimization;
    preventive_vs_reactive: PreventiveVsReactiveCostAnalysis;
  };
  
  // Inventory management
  inventory_management: {
    parts_tracking: PartsInventoryTracking;
    supplier_management: SupplierManagement;
    emergency_parts: EmergencyPartsAvailability;
    cost_tracking: PartsAndLaborCostTracking;
  };
}
```

## 💰 Fleet Cost Management

### Comprehensive Cost Tracking
```typescript
interface FleetCostManagement {
  // Cost categories
  cost_categories: {
    acquisition_costs: {
      purchase_price: VehiclePurchaseTracking;
      financing_costs: FinancingCostTracking;
      depreciation: DepreciationCalculation;
      initial_setup: InitialSetupCosts;
    };
    
    operational_costs: {
      fuel: FuelCostTracking;
      maintenance: MaintenanceCostTracking;
      insurance: InsuranceCostTracking;
      registration: RegistrationCostTracking;
      parking: ParkingCostTracking;
      tolls: TollCostTracking;
    };
    
    driver_costs: {
      driver_wages: DriverWageTracking;
      training_costs: TrainingCostTracking;
      certification: CertificationCostTracking;
      performance_bonuses: PerformanceBonusTracking;
    };
    
    administrative_costs: {
      fleet_management: FleetManagementCosts;
      technology: TechnologyCosts;
      compliance: ComplianceCosts;
      overhead: OverheadAllocation;
    };
  };
  
  // Cost allocation
  cost_allocation: {
    trip_based: TripBasedCostAllocation;
    client_billing: ClientBillingAllocation;
    department_charges: DepartmentChargebacks;
    project_allocation: ProjectCostAllocation;
  };
  
  // Cost optimization
  cost_optimization: {
    route_optimization: RouteOptimizationSavings;
    fuel_efficiency: FuelEfficiencyImprovements;
    maintenance_optimization: MaintenanceOptimization;
    utilization_improvement: UtilizationImprovements;
  };
}
```

## 📊 Fleet Analytics & Reporting

### Performance Metrics
```typescript
interface FleetPerformanceMetrics {
  // Vehicle utilization
  vehicle_utilization: {
    usage_hours: VehicleUsageHours;
    mileage_efficiency: MileageEfficiencyMetrics;
    idle_time: IdleTimeAnalysis;
    capacity_utilization: CapacityUtilizationMetrics;
  };
  
  // Driver performance
  driver_performance: {
    fuel_efficiency: DriverFuelEfficiencyScoring;
    maintenance_impact: DriverMaintenanceImpactAnalysis;
    safety_record: SafetyRecordTracking;
    cost_responsibility: CostResponsibilityAnalysis;
  };
  
  // Cost efficiency
  cost_efficiency: {
    cost_per_mile: CostPerMileAnalysis;
    cost_per_trip: CostPerTripAnalysis;
    total_cost_ownership: TotalCostOfOwnershipCalculation;
    budget_variance: BudgetVarianceAnalysis;
  };
  
  // Predictive analytics
  predictive_analytics: {
    maintenance_predictions: MaintenancePredictionModeling;
    cost_forecasting: CostForecastingModels;
    replacement_recommendations: ReplacementRecommendations;
    optimization_opportunities: OptimizationOpportunities;
  };
}
```

## 🎯 Implementation Steps

### Phase 1: Basic Fleet Management (Week 11)
1. Create vehicle CRUD operations
2. Implement basic driver management
3. Build vehicle logging system
4. Add dashboard photo capture
5. Create maintenance tracking

### Phase 2: Advanced Features (Week 12)
1. Implement AI dashboard photo processing
2. Add driver expense management
3. Build predictive maintenance system
4. Create performance tracking
5. Add third-party driver management

### Phase 3: Analytics & Optimization (Week 13)
1. Implement fleet analytics dashboard
2. Add cost optimization features
3. Build performance reporting
4. Create predictive analytics
5. Add integration with finance module

## 🔧 API Endpoints

### Vehicle Management APIs
```typescript
// GET /api/fleet/vehicles - List vehicles
// POST /api/fleet/vehicles - Create vehicle
// GET /api/fleet/vehicles/[id] - Get vehicle details
// PUT /api/fleet/vehicles/[id] - Update vehicle
// DELETE /api/fleet/vehicles/[id] - Delete vehicle

// GET /api/fleet/vehicles/[id]/logs - Vehicle logs
// POST /api/fleet/vehicles/[id]/logs - Create log entry
// GET /api/fleet/vehicles/[id]/maintenance - Maintenance history
// POST /api/fleet/vehicles/[id]/maintenance - Schedule maintenance
```

### Driver Management APIs
```typescript
// GET /api/fleet/drivers - List drivers
// POST /api/fleet/drivers/register - Register driver
// GET /api/fleet/drivers/[id] - Driver details
// PUT /api/fleet/drivers/[id] - Update driver
// POST /api/fleet/drivers/[id]/verify - Verify driver
// GET /api/fleet/drivers/[id]/performance - Driver performance
```

### Photo Processing APIs
```typescript
// POST /api/fleet/photos/process - Process dashboard photo
// GET /api/fleet/photos/[id]/status - Processing status
// POST /api/fleet/photos/[id]/validate - Validate extracted data
// GET /api/fleet/photos/[id]/history - Photo history
```

### Analytics APIs
```typescript
// GET /api/fleet/analytics/dashboard - Fleet dashboard data
// GET /api/fleet/analytics/costs - Cost analysis
// GET /api/fleet/analytics/performance - Performance metrics
// GET /api/fleet/analytics/utilization - Utilization analysis
// POST /api/fleet/reports/generate - Generate fleet report
```

---
*Dependencies: Authentication (✅), Users (🎯), Trips (🎯), AI (🎯), Expenses (🎯)*