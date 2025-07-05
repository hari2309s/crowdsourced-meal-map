export interface Database {
  public: {
    Tables: {
      food_centers: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          type: string;
          address: string;
          city: string;
          country: string;
          postal_code: string | null;
          phone: string | null;
          email: string | null;
          website: string | null;
          location: string;
          operating_hours: Record<
            string,
            { open: string; close: string }
          > | null;
          dietary_restrictions: string[] | null;
          contact_person: string | null;
          languages_spoken: string[] | null;
          capacity: number | null;
          current_availability: string;
          verified: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          type: string;
          address: string;
          city: string;
          country: string;
          postal_code?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          location: string;
          operating_hours?: Record<
            string,
            { open: string; close: string }
          > | null;
          dietary_restrictions?: string[] | null;
          contact_person?: string | null;
          languages_spoken?: string[] | null;
          capacity?: number | null;
          current_availability?: string;
          verified?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          type?: string;
          address?: string;
          city?: string;
          country?: string;
          postal_code?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          location?: string;
          operating_hours?: Record<
            string,
            { open: string; close: string }
          > | null;
          dietary_restrictions?: string[] | null;
          contact_person?: string | null;
          languages_spoken?: string[] | null;
          capacity?: number | null;
          current_availability?: string;
          verified?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      availability_updates: {
        Row: {
          id: string;
          food_center_id: string;
          status: string;
          notes: string | null;
          reported_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          food_center_id: string;
          status: string;
          notes?: string | null;
          reported_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          food_center_id?: string;
          status?: string;
          notes?: string | null;
          reported_by?: string | null;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          food_center_id: string;
          user_id: string;
          rating: number;
          comment: string | null;
          helpful_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          food_center_id: string;
          user_id: string;
          rating: number;
          comment?: string | null;
          helpful_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          food_center_id?: string;
          user_id?: string;
          rating?: number;
          comment?: string | null;
          helpful_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_reports: {
        Row: {
          id: string;
          food_center_id: string | null;
          reporter_id: string | null;
          type: string;
          content: Record<string, any>;
          status: string;
          moderated_by: string | null;
          moderated_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          food_center_id?: string | null;
          reporter_id?: string | null;
          type: string;
          content: Record<string, any>;
          status?: string;
          moderated_by?: string | null;
          moderated_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          food_center_id?: string | null;
          reporter_id?: string | null;
          type?: string;
          content?: Record<string, any>;
          status?: string;
          moderated_by?: string | null;
          moderated_at?: string | null;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: string;
          preferred_language: string;
          created_at: string;
          updated_at: string;
        };
      };
    };
    Functions: {
      get_nearby_food_centers: {
        Args: { lat: number; lng: number; radius_meters: number };
        Returns: {
          id: string;
          name: string;
          location: Record<string, any>;
          current_availability: string;
        }[];
      };
    };
  };
}
