import 'package:flutter/material.dart';
import 'package:flutter_body_atlas/flutter_body_atlas.dart';

class MuscleMapper {
  static final MuscleResolver _resolver = const MuscleResolver();

  static Color getHighlightColor(String cesPhase) {
    switch (cesPhase.toLowerCase()) {
      case 'inhibit':
        return Colors.orangeAccent;
      case 'lengthen':
        return Colors.blue;
      case 'activate':
        return Colors.redAccent;
      case 'integrate':
        return Colors.green;
      default:
        return Colors.redAccent;
    }
  }

  static List<MuscleInfo> getTargetMuscles(List<String> muscleIds) {
    List<MuscleInfo> parts = [];
    final map = <String, List<MuscleInfo>>{
      'chest': [_resolver.tryById('pectoralis_major_l')!, _resolver.tryById('pectoralis_major_r')!],
      '소흉근': [_resolver.tryById('pectoralis_major_l')!, _resolver.tryById('pectoralis_major_r')!],
      '대흉근': [_resolver.tryById('pectoralis_major_l')!, _resolver.tryById('pectoralis_major_r')!],
      '전방삼각근': [_resolver.tryById('anterior_deltoid_l')!, _resolver.tryById('anterior_deltoid_r')!],
      '삼각근': [_resolver.tryById('lateral_deltoid_l')!, _resolver.tryById('lateral_deltoid_r')!],
      '광배근': [_resolver.tryById('latissimus_dorsi_l')!, _resolver.tryById('latissimus_dorsi_r')!],
      '상부승모근': [_resolver.tryById('trapezius_upper_l')!, _resolver.tryById('trapezius_upper_r')!],
      '견갑거근': [_resolver.tryById('trapezius_upper_l')!, _resolver.tryById('trapezius_upper_r')!],
      '극하근': [_resolver.tryById('infraspinatus_l')!, _resolver.tryById('infraspinatus_r')!],
      '견갑하근': [_resolver.tryById('infraspinatus_l')!, _resolver.tryById('infraspinatus_r')!],
      '하부승모근': [_resolver.tryById('trapezius_lower_l')!, _resolver.tryById('trapezius_lower_r')!],
      '전경골근': MuscleCatalog.legs.where((m) => m.aliases.contains('shin')).toList(),
      '비복근': MuscleCatalog.legs.where((m) => m.aliases.contains('calf')).toList(),
      '가자미근': MuscleCatalog.legs.where((m) => m.aliases.contains('calf')).toList(),
      '후경골근': MuscleCatalog.legs.where((m) => m.aliases.contains('shin')).toList(),
      '비골근': MuscleCatalog.legs.where((m) => m.aliases.contains('peroneus longus')).toList(),
      '대둔근': MuscleCatalog.glutes,
      '중둔근': MuscleCatalog.glutes,
      '복횡근': MuscleCatalog.core,
      '코어': MuscleCatalog.core,
      '전거근': MuscleCatalog.core,
      'Y자': [_resolver.tryById('trapezius_lower_l')!, _resolver.tryById('trapezius_lower_r')!], // Y-Raise
      'T자': [_resolver.tryById('trapezius_middle_l')!, _resolver.tryById('trapezius_middle_r')!], // T-Raise
      '케이블': [_resolver.tryById('lateral_deltoid_l')!, _resolver.tryById('lateral_deltoid_r')!],
      '흉추': MuscleCatalog.core,
      'quads': MuscleCatalog.legs.where((m) => m.aliases.contains('quad')).toList(),
      'hamstrings': MuscleCatalog.hamstrings,
      'calves': MuscleCatalog.legs.where((m) => m.aliases.contains('calf')).toList(),
      'glutes': MuscleCatalog.glutes,
    };

    for (var id in muscleIds) {
      if (map.containsKey(id)) {
        parts.addAll(map[id]!);
      } else {
        final exact = _resolver.tryById(id);
        if (exact != null) {
          parts.add(exact);
        } else {
          // Default fallback to show *something* instead of nothing.
          parts.addAll(MuscleCatalog.core);
        }
      }
    }
    return parts;
  }
}
