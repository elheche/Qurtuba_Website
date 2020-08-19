import { TestBed } from '@angular/core/testing';

import { UserProfilService } from './user-profil.service';

describe('UserProfilService', () => {
  let service: UserProfilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserProfilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
